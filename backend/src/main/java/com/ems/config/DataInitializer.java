package com.ems.config;

import com.ems.entity.*;
import com.ems.enums.EmploymentStatus;
import com.ems.enums.RoleType;
import com.ems.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Seeds default database roles, organizational departments, and initial accounts
 * on application startup if the database is newly created.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.password:Admin@12345}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Checking database initialization status...");

        // 1. Seed Roles
        for (RoleType roleType : RoleType.values()) {
            if (roleRepository.findByName(roleType).isEmpty()) {
                roleRepository.save(new Role(roleType));
                logger.info("Initialized system role: {}", roleType);
            }
        }

        // 2. Seed Default Departments
        Department engDept = departmentRepository.findByDepartmentCode("ENG")
                .orElseGet(() -> departmentRepository.save(new Department("Engineering", "ENG", "Software engineering and infrastructure")));
        Department hrDept = departmentRepository.findByDepartmentCode("HR")
                .orElseGet(() -> departmentRepository.save(new Department("Human Resources", "HR", "People operations and talent acquisition")));
        Department opsDept = departmentRepository.findByDepartmentCode("OPS")
                .orElseGet(() -> departmentRepository.save(new Department("Operations", "OPS", "Company operations and support")));

        // 3. Seed Initial Admin Account
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN).orElseThrow();
            Role hrRole = roleRepository.findByName(RoleType.ROLE_HR).orElseThrow();

            User adminUser = new User("admin", "admin@ems.com", passwordEncoder.encode(adminPassword));
            adminUser.setRoles(new HashSet<>(Set.of(adminRole, hrRole)));
            userRepository.save(adminUser);

            Employee adminEmp = new Employee();
            adminEmp.setEmployeeCode("EMP001");
            adminEmp.setFirstName("System");
            adminEmp.setLastName("Administrator");
            adminEmp.setEmail("admin@ems.com");
            adminEmp.setPhone("+1-555-0100");
            adminEmp.setAddress("Enterprise Headquarters");
            adminEmp.setJoiningDate(LocalDate.of(2023, 1, 1));
            adminEmp.setDateOfBirth(LocalDate.of(1990, 5, 15));
            adminEmp.setDesignation("Chief Administrator");
            adminEmp.setStatus(EmploymentStatus.ACTIVE);
            adminEmp.setDepartment(engDept);
            adminEmp.setUser(adminUser);

            Employee savedAdmin = employeeRepository.save(adminEmp);
            leaveBalanceRepository.save(new LeaveBalance(savedAdmin, LocalDate.now().getYear()));

            logger.info("Default Administrator initialized: admin (Username: admin / Password: {})", adminPassword);
        }

        // 4. Seed Demo Manager Account
        Employee savedManager = null;
        if (userRepository.findByUsername("manager").isEmpty()) {
            Role managerRole = roleRepository.findByName(RoleType.ROLE_MANAGER).orElseThrow();

            User managerUser = new User("manager", "manager@ems.com", passwordEncoder.encode("Manager@12345"));
            managerUser.setRoles(new HashSet<>(Set.of(managerRole)));
            userRepository.save(managerUser);

            Employee managerEmp = new Employee();
            managerEmp.setEmployeeCode("EMP002");
            managerEmp.setFirstName("Sarah");
            managerEmp.setLastName("Connor");
            managerEmp.setEmail("manager@ems.com");
            managerEmp.setPhone("+1-555-0101");
            managerEmp.setAddress("123 Innovation Way");
            managerEmp.setJoiningDate(LocalDate.of(2024, 2, 1));
            managerEmp.setDateOfBirth(LocalDate.of(1992, 8, 20));
            managerEmp.setDesignation("Engineering Manager");
            managerEmp.setStatus(EmploymentStatus.ACTIVE);
            managerEmp.setDepartment(engDept);
            managerEmp.setUser(managerUser);

            savedManager = employeeRepository.save(managerEmp);
            leaveBalanceRepository.save(new LeaveBalance(savedManager, LocalDate.now().getYear()));
            logger.info("Demo Manager initialized: manager (Password: Manager@12345)");
        } else {
            savedManager = employeeRepository.findByEmail("manager@ems.com").orElse(null);
        }

        // 5. Seed Demo HR Account
        if (userRepository.findByUsername("hr_lead").isEmpty()) {
            Role hrRole = roleRepository.findByName(RoleType.ROLE_HR).orElseThrow();

            User hrUser = new User("hr_lead", "hr@ems.com", passwordEncoder.encode("Hr@12345"));
            hrUser.setRoles(new HashSet<>(Set.of(hrRole)));
            userRepository.save(hrUser);

            Employee hrEmp = new Employee();
            hrEmp.setEmployeeCode("EMP003");
            hrEmp.setFirstName("Jessica");
            hrEmp.setLastName("Pearson");
            hrEmp.setEmail("hr@ems.com");
            hrEmp.setPhone("+1-555-0102");
            hrEmp.setAddress("456 Corporate Plaza");
            hrEmp.setJoiningDate(LocalDate.of(2024, 3, 1));
            hrEmp.setDateOfBirth(LocalDate.of(1991, 11, 10));
            hrEmp.setDesignation("HR Business Partner");
            hrEmp.setStatus(EmploymentStatus.ACTIVE);
            hrEmp.setDepartment(hrDept);
            hrEmp.setUser(hrUser);

            Employee savedHr = employeeRepository.save(hrEmp);
            leaveBalanceRepository.save(new LeaveBalance(savedHr, LocalDate.now().getYear()));
            logger.info("Demo HR initialized: hr_lead (Password: Hr@12345)");
        }

        // 6. Seed Demo Regular Employee Account
        if (userRepository.findByUsername("john_doe").isEmpty()) {
            Role empRole = roleRepository.findByName(RoleType.ROLE_EMPLOYEE).orElseThrow();

            User devUser = new User("john_doe", "john.doe@ems.com", passwordEncoder.encode("Employee@12345"));
            devUser.setRoles(new HashSet<>(Set.of(empRole)));
            userRepository.save(devUser);

            Employee devEmp = new Employee();
            devEmp.setEmployeeCode("EMP004");
            devEmp.setFirstName("John");
            devEmp.setLastName("Doe");
            devEmp.setEmail("john.doe@ems.com");
            devEmp.setPhone("+1-555-0103");
            devEmp.setAddress("789 Silicon Blvd");
            devEmp.setJoiningDate(LocalDate.of(2025, 1, 15));
            devEmp.setDateOfBirth(LocalDate.of(1996, 4, 12));
            devEmp.setDesignation("Full Stack Software Engineer");
            devEmp.setStatus(EmploymentStatus.ACTIVE);
            devEmp.setDepartment(engDept);
            devEmp.setManager(savedManager);
            devEmp.setUser(devUser);

            Employee savedDev = employeeRepository.save(devEmp);
            leaveBalanceRepository.save(new LeaveBalance(savedDev, LocalDate.now().getYear()));
            logger.info("Demo Employee initialized: john_doe (Password: Employee@12345)");
        }

        logger.info("Database initialization verified successfully.");
    }
}
