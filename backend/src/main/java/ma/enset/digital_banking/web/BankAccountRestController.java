package ma.enset.digital_banking.web;

import lombok.AllArgsConstructor;
import ma.enset.digital_banking.dtos.*;
import ma.enset.digital_banking.exceptions.BalanceNotSufficientException;
import ma.enset.digital_banking.exceptions.BankAccountNotFoundException;
import ma.enset.digital_banking.exceptions.CustomerNotFoundException;
import ma.enset.digital_banking.services.BankAccountService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
public class BankAccountRestController {
    private BankAccountService bankAccountService;

    @GetMapping("/accounts")
    public List<BankAccountDTO> bankAccounts() {
        return bankAccountService.bankAccountList();
    }

    @GetMapping("/accounts/{accountId}")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> getAccountHistory(@PathVariable String accountId) {
        return bankAccountService.accountHistory(accountId);
    }

    @GetMapping("/accounts/{accountId}/pageOperations")
    public AccountHistoryDTO getAccountHistory(
            @PathVariable String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankAccountService.getAccountHistory(accountId, page, size);
    }

    @PostMapping("/accounts/debit")
    public void debit(@RequestBody DebitDTO debitDTO, Authentication authentication) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(debitDTO.getAccountId(), debitDTO.getAmount(), debitDTO.getDescription(), authentication.getName());
    }

    @PostMapping("/accounts/credit")
    public void credit(@RequestBody CreditDTO creditDTO, Authentication authentication) throws BankAccountNotFoundException {
        bankAccountService.credit(creditDTO.getAccountId(), creditDTO.getAmount(), creditDTO.getDescription(), authentication.getName());
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestBody TransferRequestDTO transferRequestDTO, Authentication authentication) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(
                transferRequestDTO.getAccountSource(),
                transferRequestDTO.getAccountDestination(),
                transferRequestDTO.getAmount(),
                authentication.getName()
        );
    }

    @PostMapping("/accounts/current")
    public CurrentBankAccountDTO saveCurrentBankAccount(
            @RequestParam double initialBalance,
            @RequestParam double overDraft,
            @RequestParam Long customerId,
            Authentication authentication) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(initialBalance, overDraft, customerId, authentication.getName());
    }

    @PostMapping("/accounts/saving")
    public SavingBankAccountDTO saveSavingBankAccount(
            @RequestParam double initialBalance,
            @RequestParam double interestRate,
            @RequestParam Long customerId,
            Authentication authentication) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(initialBalance, interestRate, customerId, authentication.getName());
    }
}
