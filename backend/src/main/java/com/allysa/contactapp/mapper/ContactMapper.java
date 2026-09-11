package com.allysa.contactapp.mapper;

import com.allysa.contactapp.dto.ContactRequest;
import com.allysa.contactapp.dto.ContactResponse;
import com.allysa.contactapp.entity.Contact;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ContactMapper {

    public Contact toEntity(ContactRequest request) {
        Contact contact = new Contact();

        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());

        return contact;
    }

    public ContactResponse toResponse(Contact contact) {
        ContactResponse response = new ContactResponse();

        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setPhone(contact.getPhone());
        response.setSubject(contact.getSubject());
        response.setMessage(contact.getMessage());
        response.setCreatedAt(contact.getCreatedAt());
        response.setUpdatedAt(contact.getUpdatedAt());

        return response;
    }
}
