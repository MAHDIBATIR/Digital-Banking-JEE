package ma.enset.digital_banking.security.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.digital_banking.dtos.CustomerDTO;
import ma.enset.digital_banking.security.dto.RegisterRequest;
import ma.enset.digital_banking.security.entities.AppRole;
import ma.enset.digital_banking.security.repositories.AppRoleRepository;
import ma.enset.digital_banking.security.repositories.AppUserRepository;
import ma.enset.digital_banking.security.service.SecurityService;
import ma.enset.digital_banking.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SecurityService securityService;
    private final AppRoleRepository roleRepository;
    private final AppUserRepository userRepository;
    private final BankAccountService bankAccountService;
    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            log.info("Initializing default roles");
            securityService.saveRole("USER");
            securityService.saveRole("ADMIN");
            log.info("Default roles created");
        }

        // Initialize admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            log.info("Creating admin user");
            RegisterRequest adminUserRequest = RegisterRequest.builder()
                    .username("admin")
                    .password("admin123")
                    .email("admin@example.com")
                    .fullName("Administrator")
                    .build();
            
            securityService.saveUser(adminUserRequest);
            securityService.addRoleToUser("admin", "ADMIN");
            log.info("Admin user created with credentials: admin/admin123");
        }
        
        // Initialize regular user if it doesn't exist
        if (!userRepository.existsByUsername("user")) {
            log.info("Creating regular user");
            RegisterRequest userRequest = RegisterRequest.builder()
                    .username("user")
                    .password("user123")
                    .email("user@example.com")
                    .fullName("Regular User")
                    .build();
            
            securityService.saveUser(userRequest);
            log.info("Regular user created with credentials: user/user123");
        }
        
        // Add 10 customers with Arabic names in Latin letters
        createArabicNamedCustomers();
    }
    
    private void createArabicNamedCustomers() {
        // List of customer data (username, full name, email)
        List<String[]> customerData = new ArrayList<>();
        customerData.add(new String[]{"ahmed", "Ahmed Al-Mansouri", "ahmed@example.com"});
        customerData.add(new String[]{"fatima", "Fatima El-Zahrawi", "fatima@example.com"});
        customerData.add(new String[]{"mohammed", "Mohammed Ibn Battuta", "mohammed@example.com"});
        customerData.add(new String[]{"layla", "Layla Al-Kindi", "layla@example.com"});
        customerData.add(new String[]{"omar", "Omar Al-Farouq", "omar@example.com"});
        customerData.add(new String[]{"aisha", "Aisha Bint Abu Bakr", "aisha@example.com"});
        customerData.add(new String[]{"yusuf", "Yusuf Al-Qaradawi", "yusuf@example.com"});
        customerData.add(new String[]{"zainab", "Zainab Al-Ghazali", "zainab@example.com"});
        customerData.add(new String[]{"kareem", "Kareem Abdul-Jabbar", "kareem@example.com"});
        customerData.add(new String[]{"nadia", "Nadia El-Mourabiti", "nadia@example.com"});
        
        for (String[] data : customerData) {
            String username = data[0];
            String fullName = data[1];
            String email = data[2];
            
            // Only create if user doesn't already exist
            if (!userRepository.existsByUsername(username)) {
                log.info("Creating customer: {}", fullName);
                RegisterRequest customerRequest = RegisterRequest.builder()
                        .username(username)
                        .password("password123")
                        .email(email)
                        .fullName(fullName)
                        .build();
                
                securityService.saveUser(customerRequest);
                
                // Create customer in the banking system
                CustomerDTO customerDTO = new CustomerDTO();
                customerDTO.setName(fullName);
                customerDTO.setEmail(email);
                customerDTO.setCreatedBy("admin");
                CustomerDTO savedCustomer = bankAccountService.saveCustomer(customerDTO);
                
                // Create bank accounts for the customer
                createBankAccounts(savedCustomer.getId(), "admin");
            }
        }
        
        log.info("Arabic-named customers created successfully with bank accounts");
    }
    
    private void createBankAccounts(Long customerId, String username) {
        try {
            // Create a Current Account with random balance and overdraft
            double initialBalanceCurrent = 1000 + random.nextDouble() * 9000;  // Between 1,000 and 10,000
            double overDraft = 500 + random.nextDouble() * 1500;  // Between 500 and 2,000
            bankAccountService.saveCurrentBankAccount(initialBalanceCurrent, overDraft, customerId, username);
            
            // Create a Saving Account with random balance and interest rate
            double initialBalanceSaving = 5000 + random.nextDouble() * 15000;  // Between 5,000 and 20,000
            double interestRate = 2.5 + random.nextDouble() * 2.5;  // Between 2.5% and 5%
            bankAccountService.saveSavingBankAccount(initialBalanceSaving, interestRate, customerId, username);
            
            // Add some operations
            // The accounts will be created, but adding operations would require getting the account IDs
            // which would make this more complex - we'll leave that for now
            
            log.info("Created bank accounts for customer ID: {}", customerId);
        } catch (Exception e) {
            log.error("Error creating bank accounts for customer ID {}: {}", customerId, e.getMessage());
        }
    }
} 