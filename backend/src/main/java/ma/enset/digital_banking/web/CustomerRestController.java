package ma.enset.digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.digital_banking.dtos.CustomerDTO;
import ma.enset.digital_banking.exceptions.CustomerNotFoundException;
import ma.enset.digital_banking.services.BankAccountService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@CrossOrigin("*")
public class CustomerRestController {
    private BankAccountService bankAccountService;

    @GetMapping("/customers")
    public List<CustomerDTO> customers(Authentication authentication) {
        if (authentication != null) {
            log.info("Customer list accessed by: " + authentication.getName());
        }
        return bankAccountService.listCustomers();
    }

    @GetMapping("/customers/search")
    public List<CustomerDTO> searchCustomers(@RequestParam(name = "keyword", defaultValue = "") String keyword, 
                                             Authentication authentication) {
        if (authentication != null) {
            log.info("Customer search performed by: " + authentication.getName() + " with keyword: " + keyword);
        }
        return bankAccountService.searchCustomers(keyword);
    }

    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomer(@PathVariable(name = "id") Long customerId, 
                                   Authentication authentication) throws CustomerNotFoundException {
        if (authentication != null) {
            log.info("Customer details accessed by: " + authentication.getName() + " for customer ID: " + customerId);
        }
        return bankAccountService.getCustomer(customerId);
    }

    @PostMapping("/customers")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO, Authentication authentication) {
        if (authentication != null) {
            customerDTO.setCreatedBy(authentication.getName());
            log.info("Customer created by: " + authentication.getName());
        }
        return bankAccountService.saveCustomer(customerDTO);
    }

    @PutMapping("/customers/{customerId}")
    public CustomerDTO updateCustomer(@PathVariable Long customerId, 
                                    @RequestBody CustomerDTO customerDTO, 
                                    Authentication authentication) {
        customerDTO.setId(customerId);
        if (authentication != null) {
            customerDTO.setCreatedBy(authentication.getName()); 
            log.info("Customer updated by: " + authentication.getName() + " for customer ID: " + customerId);
        }
        return bankAccountService.updateCustomer(customerDTO);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable Long id, Authentication authentication) {
        if (authentication != null) {
            log.info("Customer deleted by: " + authentication.getName() + " for customer ID: " + id);
        }
        bankAccountService.deleteCustomer(id);
    }
}
