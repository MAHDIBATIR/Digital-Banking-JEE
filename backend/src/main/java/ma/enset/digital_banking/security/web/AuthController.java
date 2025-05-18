package ma.enset.digital_banking.security.web;

import lombok.RequiredArgsConstructor;
import ma.enset.digital_banking.security.entities.AppUser;
import ma.enset.digital_banking.security.jwt.JwtUtil;
import ma.enset.digital_banking.security.service.SecurityService;
import ma.enset.digital_banking.security.web.dto.AuthRequest;
import ma.enset.digital_banking.security.web.dto.AuthResponse;
import ma.enset.digital_banking.security.web.dto.PasswordChangeRequest;
import ma.enset.digital_banking.security.web.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final SecurityService securityService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AppUser user = securityService.saveNewUser(
                request.getUsername(),
                request.getPassword(),
                request.getEmail()
        );
        securityService.addRoleToUser(user.getUsername(), "USER");
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        AppUser user = securityService.loadUserByUsername(request.getUsername());
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordChangeRequest request,
            Authentication authentication) {
        try {
            securityService.updateUserPassword(
                    authentication.getName(),
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok(securityService.listUsers());
    }
}
