package ma.enset.digital_banking.dtos;

import lombok.Data;
import ma.enset.digital_banking.entities.enums.AccountStatus;

import java.util.Date;

@Data
public abstract class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO;
    private String type;
}
