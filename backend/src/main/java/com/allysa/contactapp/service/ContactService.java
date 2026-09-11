package com.allysa.contactapp.service;

import com.allysa.contactapp.dto.ContactRequest;
import com.allysa.contactapp.dto.ContactResponse;
import com.allysa.contactapp.entity.Contact;

import java.util.List;

public interface ContactService {

    ContactResponse create(ContactRequest request);

    List<ContactResponse> findAll();

    ContactResponse findById(Long id);

    ContactResponse update(Long id, ContactRequest contact);

    void delete(Long id);
}
