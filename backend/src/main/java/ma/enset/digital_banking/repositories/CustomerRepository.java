package ma.enset.digital_banking.repositories;

import ma.enset.digital_banking.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByNameContains(String keyword);

    @Query("SELECT c FROM Customer c WHERE c.name LIKE :kw")
    List<Customer> searchCustomers(@Param("kw") String keyword);
}
