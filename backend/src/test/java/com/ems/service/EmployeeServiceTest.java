package com.ems.service;

import com.ems.dto.EmployeeRequestDTO;
import com.ems.dto.EmployeeResponseDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.Role;
import com.ems.enums.EmploymentStatus;
import com.ems.enums.RoleType;
import com.ems.exception.DuplicateResourceException;
import com.ems.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private LeaveBalanceRepository leaveBalanceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeService employeeService;

    private Department department;

    @BeforeEach
    void setUp() {
        department = new Department("Engineering", "ENG", "Core engineering");
        department.setId(1L);
    }

    @Test
    @DisplayName("Should create employee successfully")
    void testCreateEmployee_Success() {
        EmployeeRequestDTO dto = new EmployeeRequestDTO();
        dto.setEmployeeCode("EMP100");
        dto.setFirstName("Robert");
        dto.setLastName("Martin");
        dto.setEmail("robert@ems.com");
        dto.setDesignation("Lead Architect");
        dto.setJoiningDate(LocalDate.now());
        dto.setDepartmentId(1L);

        when(employeeRepository.existsByEmployeeCode("EMP100")).thenReturn(false);
        when(employeeRepository.existsByEmail("robert@ems.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> {
            Employee e = inv.getArgument(0);
            e.setId(50L);
            return e;
        });

        EmployeeResponseDTO result = employeeService.createEmployee(dto);

        assertNotNull(result);
        assertEquals("EMP100", result.getEmployeeCode());
        assertEquals("Robert", result.getFirstName());
        verify(employeeRepository, times(1)).save(any(Employee.class));
        verify(leaveBalanceRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when employee code exists")
    void testCreateEmployee_DuplicateCode() {
        EmployeeRequestDTO dto = new EmployeeRequestDTO();
        dto.setEmployeeCode("EMP100");

        when(employeeRepository.existsByEmployeeCode("EMP100")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(dto));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should deactivate employee on delete")
    void testDeleteEmployee_SoftDeactivation() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setStatus(EmploymentStatus.ACTIVE);

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        employeeService.deleteEmployee(1L);

        assertEquals(EmploymentStatus.INACTIVE, employee.getStatus());
        verify(employeeRepository, times(1)).save(employee);
    }
}
