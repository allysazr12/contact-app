package com.allysa.contactapp.service;

import com.allysa.contactapp.dto.ContactRequest;
import com.allysa.contactapp.dto.ContactResponse;
import com.allysa.contactapp.entity.Contact;
import com.allysa.contactapp.exception.ResourceNotFoundException;
import com.allysa.contactapp.mapper.ContactMapper;
import com.allysa.contactapp.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    public ContactResponse create(ContactRequest request) {
        Contact contact = ContactMapper.toEntity(request);
        Contact savedContact = contactRepository.save(contact);

        return ContactMapper.toResponse(savedContact);
    }

    @Override
    public List<ContactResponse> findAll() {
        return contactRepository.findAll()
                .stream()
                .map(ContactMapper::toResponse)
                .toList();
    }

    @Override
    public ContactResponse findById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + id
                        ));

        return ContactMapper.toResponse(contact);
    }

    @Override
    public ContactResponse update(Long id, ContactRequest request) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + id
                        ));

        existingContact.setName(request.getName());
        existingContact.setEmail(request.getEmail());
        existingContact.setPhone(request.getPhone());
        existingContact.setSubject(request.getSubject());
        existingContact.setMessage(request.getMessage());

        Contact updatedContact = contactRepository.save(existingContact);

        return ContactMapper.toResponse(updatedContact);
    }

    @Override
    public void delete(Long id) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + id
                        ));;
        contactRepository.delete(existingContact);
    }
}
