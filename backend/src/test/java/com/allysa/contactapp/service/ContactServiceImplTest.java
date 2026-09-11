package com.allysa.contactapp.service;

import com.allysa.contactapp.dto.ContactRequest;
import com.allysa.contactapp.dto.ContactResponse;
import com.allysa.contactapp.entity.Contact;
import com.allysa.contactapp.exception.ResourceNotFoundException;
import com.allysa.contactapp.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceImplTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactServiceImpl contactService;

    private Contact contact;
    private ContactRequest request;

    @BeforeEach
    void setUp() {
        contact = new Contact();
        contact.setName("Allysa");
        contact.setEmail("allysa@example.com");
        contact.setPhone("08123456789");
        contact.setSubject("Test Subject");
        contact.setMessage("Test message");

        request = new ContactRequest();
        request.setName("Allysa");
        request.setEmail("allysa@example.com");
        request.setPhone("08123456789");
        request.setSubject("Test Subject");
        request.setMessage("Test message");
    }

    @Test
    void create_shouldReturnSavedContact() {
        when(contactRepository.save(any(Contact.class)))
                .thenReturn(contact);

        ContactResponse response = contactService.create(request);

        assertNotNull(response);
        assertEquals("Allysa", response.getName());
        assertEquals("allysa@example.com", response.getEmail());

        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void findAll_shouldReturnContactList() {
        when(contactRepository.findAll())
                .thenReturn(List.of(contact));

        List<ContactResponse> responses = contactService.findAll();

        assertEquals(1, responses.size());
        assertEquals("Allysa", responses.get(0).getName());

        verify(contactRepository).findAll();
    }

    @Test
    void findById_shouldReturnContact() {
        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(contact));

        ContactResponse response = contactService.findById(1L);

        assertNotNull(response);
        assertEquals("Allysa", response.getName());

        verify(contactRepository).findById(1L);
    }

    @Test
    void findById_shouldThrowExceptionWhenContactNotFound() {
        when(contactRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> contactService.findById(1L)
        );

        verify(contactRepository).findById(1L);
    }

    @Test
    void update_shouldReturnUpdatedContact() {
        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(contact));

        when(contactRepository.save(any(Contact.class)))
                .thenReturn(contact);

        ContactResponse response =
                contactService.update(1L, request);

        assertNotNull(response);
        assertEquals("Allysa", response.getName());
        assertEquals("allysa@example.com", response.getEmail());

        verify(contactRepository).findById(1L);
        verify(contactRepository).save(contact);
    }

    @Test
    void delete_shouldDeleteContact() {
        when(contactRepository.findById(1L))
                .thenReturn(Optional.of(contact));

        contactService.delete(1L);

        verify(contactRepository).findById(1L);
        verify(contactRepository).delete(contact);
    }

    @Test
    void delete_shouldThrowExceptionWhenContactNotFound() {
        when(contactRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> contactService.delete(1L)
        );

        verify(contactRepository).findById(1L);
        verify(contactRepository, never()).delete(any(Contact.class));
    }
}