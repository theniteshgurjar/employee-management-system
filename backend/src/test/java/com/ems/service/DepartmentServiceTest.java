package com.ems.service;

import com.ems.dto.DepartmentRequestDTO;
import com.ems.dto.DepartmentResponseDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.BadRequestException;
import com.ems.exception.DuplicateResourceException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private DepartmentService departmentService;

    private Department department;

    @BeforeEach
    void setUp() {
        department = new Department("Engineering", "ENG", "Core software development");
        department.setId(1L);
    }

    @Test
    @DisplayName("Should create department successfully")
    void testCreateDepartment_Success() {
        DepartmentRequestDTO request = new DepartmentRequestDTO("Finance", "FIN", "Financial operations");

        when(departmentRepository.existsByDepartmentCode("FIN")).thenReturn(false);
        when(departmentRepository.existsByName("Finance")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenAnswer(inv -> {
            Department d = inv.getArgument(0);
            d.setId(2L);
            return d;
        });

        DepartmentResponseDTO response = departmentService.createDepartment(request);

        assertNotNull(response);
        assertEquals("FIN", response.getDepartmentCode());
        assertEquals("Finance", response.getName());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException on duplicate code")
    void testCreateDepartment_DuplicateCode() {
        DepartmentRequestDTO request = new DepartmentRequestDTO("Engineering 2", "ENG", "Duplicate code");

        when(departmentRepository.existsByDepartmentCode("ENG")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> departmentService.createDepartment(request));
    }

    @Test
    @DisplayName("Should safely prevent deletion if department contains employees")
    void testDeleteDepartment_PreventDeletionWithEmployees() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(employeeRepository.findByDepartmentId(1L)).thenReturn(List.of(new Employee()));

        assertThrows(BadRequestException.class, () -> departmentService.deleteDepartment(1L));
        verify(departmentRepository, never()).delete(any());
    }
}
