package ma.enset.digital_banking.security.service;

import ma.enset.digital_banking.security.dto.RegisterRequest;
import ma.enset.digital_banking.security.entities.AppRole;
import ma.enset.digital_banking.security.entities.AppUser;

import java.util.List;

public interface SecurityService {
    AppUser saveUser(RegisterRequest request);
    AppRole saveRole(String roleName);
    void addRoleToUser(String username, String roleName);
    void removeRoleFromUser(String username, String roleName);
    AppUser loadUserByUsername(String username);
    List<AppUser> listUsers();
    List<AppRole> listRoles();
    boolean hasRole(String username, String roleName);
    void setUserAsAdmin(String username);
}
