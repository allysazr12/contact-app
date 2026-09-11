package com.allysa.contactapp.controller;

import com.allysa.contactapp.dto.ContactRequest;
import com.allysa.contactapp.dto.ContactResponse;
import com.allysa.contactapp.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> create (
            @Valid @RequestBody ContactRequest request
    ) {
        ContactResponse response = contactService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> findAll() {
        return ResponseEntity.ok(contactService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> findById (
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                contactService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> update (
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.ok(
                contactService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete (
            @PathVariable Long id
    ) {
        contactService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
