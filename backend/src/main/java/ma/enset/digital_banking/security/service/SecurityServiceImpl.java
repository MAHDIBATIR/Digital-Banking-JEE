package ma.enset.digital_banking.security.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.digital_banking.security.dto.RegisterRequest;
import ma.enset.digital_banking.security.entities.AppRole;
import ma.enset.digital_banking.security.entities.AppUser;
import ma.enset.digital_banking.security.repositories.AppRoleRepository;
import ma.enset.digital_banking.security.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SecurityServiceImpl implements SecurityService {

    private final AppUserRepository userRepository;
    private final AppRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser saveUser(RegisterRequest request) {
        log.info("Saving new user {} to the database", request.getUsername());
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        AppUser user = AppUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .roles(new ArrayList<>())
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .enabled(true)
                .build();
        
        // Save the user first to prevent a NullPointerException
        AppUser savedUser = userRepository.save(user);
        
        // Now add the USER role
        AppRole userRole = roleRepository.findByRoleName("USER")
                .orElseGet(() -> roleRepository.save(AppRole.builder().roleName("USER").build()));
        
        savedUser.getRoles().add(userRole);
        
        return savedUser;
    }

    @Override
    public AppRole saveRole(String roleName) {
        log.info("Saving new role {} to the database", roleName);
        return roleRepository.save(AppRole.builder().roleName(roleName).build());
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);
        AppUser user = loadUserByUsername(username);
        AppRole role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        
        user.getRoles().add(role);
    }

    @Override
    public void removeRoleFromUser(String username, String roleName) {
        log.info("Removing role {} from user {}", roleName, username);
        AppUser user = loadUserByUsername(username);
        AppRole role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        
        user.getRoles().remove(role);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    @Override
    public List<AppUser> listUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    @Override
    public List<AppRole> listRoles() {
        log.info("Fetching all roles");
        return roleRepository.findAll();
    }

    @Override
    public boolean hasRole(String username, String roleName) {
        AppUser user = loadUserByUsername(username);
        return user.getRoles().stream()
                .anyMatch(role -> role.getRoleName().equals(roleName));
    }

    @Override
    public void setUserAsAdmin(String username) {
        log.info("Setting user {} as admin", username);
        if (!hasRole(username, "ADMIN")) {
            addRoleToUser(username, "ADMIN");
        }
    }
}
