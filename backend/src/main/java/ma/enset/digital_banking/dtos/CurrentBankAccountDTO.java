package ma.enset.digital_banking.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentAccountDTO extends BankAccountDTO {
    private double overDraft;
}
