package com.ems.service;

import com.ems.dto.EmployeeRequestDTO;
import com.ems.dto.EmployeeResponseDTO;
import com.ems.entity.*;
import com.ems.enums.EmploymentStatus;
import com.ems.enums.RoleType;
import com.ems.exception.BadRequestException;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        return mapToResponse(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeByUsername(String username) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for username: " + username));
        return mapToResponse(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> searchEmployees(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllEmployees();
        }
        return employeeRepository.searchEmployees(keyword.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getTeamMembers(Long managerId) {
        return employeeRepository.findByManagerId(managerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        if (employeeRepository.existsByEmployeeCode(dto.getEmployeeCode())) {
            throw new DuplicateResourceException("Employee code '" + dto.getEmployeeCode() + "' is already registered.");
        }
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' is already in use by another employee.");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        Employee manager = null;
        if (dto.getManagerId() != null) {
            manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + dto.getManagerId()));
        }

        Employee employee = new Employee();
        employee.setEmployeeCode(dto.getEmployeeCode().trim().toUpperCase());
        employee.setFirstName(dto.getFirstName().trim());
        employee.setLastName(dto.getLastName().trim());
        employee.setEmail(dto.getEmail().trim().toLowerCase());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setDesignation(dto.getDesignation().trim());
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : EmploymentStatus.ACTIVE);
        employee.setDepartment(department);
        employee.setManager(manager);

        // Create linked User account if username & password provided
        if (dto.getUsername() != null && !dto.getUsername().trim().isEmpty()) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new DuplicateResourceException("Username '" + dto.getUsername() + "' is already taken.");
            }
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new DuplicateResourceException("User email '" + dto.getEmail() + "' is already taken.");
            }

            User user = new User(
                    dto.getUsername().trim(),
                    dto.getEmail().trim().toLowerCase(),
                    passwordEncoder.encode(dto.getPassword() != null ? dto.getPassword() : "Temp@12345")
            );

            Set<Role> roles = new HashSet<>();
            if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
                for (String r : dto.getRoles()) {
                    RoleType rt = RoleType.valueOf(r.startsWith("ROLE_") ? r : "ROLE_" + r);
                    roles.add(roleRepository.findByName(rt)
                            .orElseThrow(() -> new BadRequestException("Role not found: " + rt)));
                }
            } else {
                roles.add(roleRepository.findByName(RoleType.ROLE_EMPLOYEE).orElseThrow());
            }
            user.setRoles(roles);
            employee.setUser(user);
        }

        Employee saved = employeeRepository.save(employee);

        // Allocate default leave balance for current year
        LeaveBalance balance = new LeaveBalance(saved, LocalDate.now().getYear());
        leaveBalanceRepository.save(balance);

        return mapToResponse(saved);
    }

    @Transactional
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        if (!employee.getEmployeeCode().equalsIgnoreCase(dto.getEmployeeCode()) &&
            employeeRepository.existsByEmployeeCode(dto.getEmployeeCode())) {
            throw new DuplicateResourceException("Employee code '" + dto.getEmployeeCode() + "' is already in use.");
        }

        if (!employee.getEmail().equalsIgnoreCase(dto.getEmail()) &&
            employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' is already in use.");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        Employee manager = null;
        if (dto.getManagerId() != null) {
            if (dto.getManagerId().equals(id)) {
                throw new BadRequestException("An employee cannot be their own manager.");
            }
            manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + dto.getManagerId()));
        }

        employee.setEmployeeCode(dto.getEmployeeCode().trim().toUpperCase());
        employee.setFirstName(dto.getFirstName().trim());
        employee.setLastName(dto.getLastName().trim());
        employee.setEmail(dto.getEmail().trim().toLowerCase());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setDesignation(dto.getDesignation().trim());
        if (dto.getStatus() != null) {
            employee.setStatus(dto.getStatus());
            if (employee.getUser() != null) {
                employee.getUser().setEnabled(dto.getStatus() == EmploymentStatus.ACTIVE);
            }
        }
        employee.setDepartment(department);
        employee.setManager(manager);

        // Update roles if provided
        if (employee.getUser() != null && dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> updatedRoles = new HashSet<>();
            for (String r : dto.getRoles()) {
                RoleType rt = RoleType.valueOf(r.startsWith("ROLE_") ? r : "ROLE_" + r);
                updatedRoles.add(roleRepository.findByName(rt)
                        .orElseThrow(() -> new BadRequestException("Role not found: " + rt)));
            }
            employee.getUser().setRoles(updatedRoles);
        }

        Employee updated = employeeRepository.save(employee);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        // Soft deactivation to preserve audit integrity
        employee.setStatus(EmploymentStatus.INACTIVE);
        if (employee.getUser() != null) {
            employee.getUser().setEnabled(false);
        }
        employeeRepository.save(employee);
    }

    public EmployeeResponseDTO mapToResponse(Employee emp) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(emp.getId());
        dto.setEmployeeCode(emp.getEmployeeCode());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setPhone(emp.getPhone());
        dto.setAddress(emp.getAddress());
        dto.setDateOfBirth(emp.getDateOfBirth());
        dto.setJoiningDate(emp.getJoiningDate());
        dto.setDesignation(emp.getDesignation());
        dto.setStatus(emp.getStatus());

        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName());
            dto.setDepartmentCode(emp.getDepartment().getDepartmentCode());
        }

        if (emp.getManager() != null) {
            dto.setManagerId(emp.getManager().getId());
            dto.setManagerName(emp.getManager().getFirstName() + " " + emp.getManager().getLastName());
        }

        if (emp.getUser() != null) {
            dto.setUserId(emp.getUser().getId());
            dto.setUsername(emp.getUser().getUsername());
            dto.setRoles(emp.getUser().getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet()));
        }

        dto.setCreatedAt(emp.getCreatedAt());
        dto.setUpdatedAt(emp.getUpdatedAt());
        return dto;
    }
}
