package com.ems.service;

import com.ems.dto.DepartmentRequestDTO;
import com.ems.dto.DepartmentResponseDTO;
import com.ems.dto.EmployeeResponseDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.BadRequestException;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToResponse(department);
    }

    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {
        if (departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new DuplicateResourceException("Department code '" + dto.getDepartmentCode() + "' is already registered.");
        }
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department name '" + dto.getName() + "' already exists.");
        }

        Department department = new Department(
                dto.getName().trim(),
                dto.getDepartmentCode().trim().toUpperCase(),
                dto.getDescription() != null ? dto.getDescription().trim() : null
        );

        Department saved = departmentRepository.save(department);
        return mapToResponse(saved);
    }

    @Transactional
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        if (!department.getDepartmentCode().equalsIgnoreCase(dto.getDepartmentCode()) &&
            departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new DuplicateResourceException("Department code '" + dto.getDepartmentCode() + "' is already taken.");
        }

        if (!department.getName().equalsIgnoreCase(dto.getName()) &&
            departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department name '" + dto.getName() + "' already exists.");
        }

        department.setName(dto.getName().trim());
        department.setDepartmentCode(dto.getDepartmentCode().trim().toUpperCase());
        department.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);

        Department updated = departmentRepository.save(department);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        List<Employee> assignedEmployees = employeeRepository.findByDepartmentId(id);
        if (!assignedEmployees.isEmpty()) {
            throw new BadRequestException("Cannot delete department '" + department.getName() +
                    "' because " + assignedEmployees.size() + " employee(s) are currently assigned to it. Reassign them first.");
        }

        departmentRepository.delete(department);
    }

    private DepartmentResponseDTO mapToResponse(Department dept) {
        DepartmentResponseDTO dto = new DepartmentResponseDTO();
        dto.setId(dept.getId());
        dto.setName(dept.getName());
        dto.setDepartmentCode(dept.getDepartmentCode());
        dto.setDescription(dept.getDescription());
        dto.setCreatedAt(dept.getCreatedAt());
        dto.setUpdatedAt(dept.getUpdatedAt());

        List<Employee> emps = employeeRepository.findByDepartmentId(dept.getId());
        dto.setEmployeeCount(emps.size());
        return dto;
    }
}
