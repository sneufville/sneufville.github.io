/********f************
    
	Project 4 Website Development
	Name: Simon Neufville
	Date: November 27, 2023
	Description: Demonstrates an understanding of using all concepts learned from WEBD-1007 to design and build a website.
	Icons used are sourced from uxwing (refer to license information: https://uxwing.com/license/). Images are from unsplash.com (refer to license information: https://unsplash.com/license)

*********************/

// Constants
const LKEY_MESSAGE = '_CONTACT_MESSAGE'
const Contact_Form_Name = 'contactForm_Name';
const Contact_Form_Email = 'contactForm_Email';
const Contact_Form_Phone = 'contactForm_Phone';
const Contact_Form_Contact_Type = 'contactForm_ContactType';
const Contact_Form_Message = 'contactForm_Message';

const Name_Error_Required = 'nameError_Required';
const Email_Error_Format = 'emailError_Format';
const Phone_Error_Format = 'phoneError_Format';
const Message_Error_Required = 'messageError_Required';


// function to set the active class on nav link

/**
 * @function setActiveLinkElement
 * @description Function that adds the active link class to the matching nav element based on the current page
 * from window.location.href
 */
function setActiveLinkElement() {

	const target = getCurrentPageName();
	if (target !== 'message-confirmation') {

		const navElement = document.getElementById('siteNav');
		for (let n = 0; n < navElement.children.length; n++) {
			navElement.children[n].classList.remove('navLink_Active');
		}
		
		const activeElement = document.getElementById(`navLink_${target}`);
		activeElement.classList.add('navLink_Active');
	}
}

/**
 * 
 * @returns {string} the name of the current page without the extension
 */
function getCurrentPageName() {
	const currentLocation = window.location.href;
	const parts = currentLocation.split('/');
	const pageName = parts[parts.length - 1];
	const target = pageName.split('.');
	return target[0];
}

function setupAboutPage() {
	const pageName = getCurrentPageName();
	if (pageName !== 'about') return;
	document.addEventListener('submit', validateAndSubmitContact);
	localStorage.removeItem(LKEY_MESSAGE);
	resetFormErrors();
}

/**
 * 
 * @param {string} phoneNumber the text that should be validated as a phone number
 * @returns {boolean} indicate if a phone number is valid
 */
function validatePhone(phoneNumber) {
	const PATTERN = /^\d{3}-\d{3}-\d{4}$/g;
	return PATTERN.test(phoneNumber);
}

function validateEmail(emailAddress) {
	const EMAIL_PATTERN = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	return EMAIL_PATTERN.test(emailAddress);
}

function resetFormErrors() {
	const nameErrorRequired = document.getElementById(Name_Error_Required);
	nameErrorRequired.style.display = 'none';
	const emailErrorFormat = document.getElementById(Email_Error_Format);
	emailErrorFormat.style.display = 'none';
	const phoneErrorFormat = document.getElementById(Phone_Error_Format);
	phoneErrorFormat.style.display = 'none';
	const messageErrorRequired = document.getElementById(Message_Error_Required);
	messageErrorRequired.style.display = 'none';
}

/**
 * @function showErrors
 * @description Helper function that shows errors and where applicable, focuses the first field in the array of errors
 * @param {Array} errors 
 */
function showErrors(errors) {
	for (let e = 0; e < errors.length; e++) {
		const element = document.getElementById(errors[e].errorElement);
		if (element) element.style.display = 'block';
	}

	// focus first error
	if (errors.length) {
		const firstElement = errors[0];
		const targetField = document.getElementById(firstElement.fieldId);
		if (targetField) targetField.focus();
	}
}

function validateAndSubmitContact(e) {
	localStorage.removeItem(LKEY_MESSAGE);
	resetFormErrors();
	e.preventDefault();
	const errors = [];

	const fullNameValue = document.getElementById(Contact_Form_Name).value;
	const emailAddressValue = document.getElementById(Contact_Form_Email).value;
	const phoneNumberValue = document.getElementById(Contact_Form_Phone).value;
	const messageTypeValue = document.getElementById(Contact_Form_Contact_Type).value;
	const messageValue = document.getElementById(Contact_Form_Message).value;

	if (String(fullNameValue).trim().length < 2) {
		errors.push({
			errorElement: Name_Error_Required,
			fieldId: Contact_Form_Name,
		});
	}

	if (!validateEmail(emailAddressValue)) {
		errors.push({
			errorElement: Email_Error_Format,
			fieldId: Contact_Form_Email,
		});
	}

	if (!validatePhone(phoneNumberValue)) {
		errors.push({
			errorElement: Phone_Error_Format,
			fieldId: Contact_Form_Phone
		});
	}

	if (String(messageValue).trim().length < 10) {
		errors.push({
			errorElement: Message_Error_Required,
			fieldId: Contact_Form_Message,
		});
	}

	if (errors.length) {
		return showErrors(errors);
	}

	const formData = {
		contactName: fullNameValue,
		emailAddress: emailAddressValue,
		phoneNumber: phoneNumberValue,
		contactType: messageTypeValue,
		message: messageValue,
		messageDate: new Date().toISOString(),
	}

	console.log(formData);

	localStorage.setItem(LKEY_MESSAGE, JSON.stringify(formData));
	window.location.href = 'message-confirmation.html';
}

/**
 * @function setupMessageConfirmPage
 * @description Simulates a message sent from a contact form
 * @returns void
 */
function setupMessageConfirmPage() {
	const currentPage = getCurrentPageName();

	const messageData = localStorage.getItem(LKEY_MESSAGE);
	if (!messageData) return;
	if (currentPage === 'message-confirmation' && !messageData) {
		return window.location.href = 'index.html';
	}

	const userMessage = JSON.parse(messageData);

	// construct message element
	const messageContainerElement = document.createElement('div');
	messageContainerElement.classList.add('messageContainer');
	
	const contentElement = document.createElement('p');
	contentElement.classList.add('messageContent');
	contentElement.innerText = userMessage['message'];
	
	const messageTypeElement = document.createElement('p');
	messageTypeElement.innerText = userMessage['contactType'];

	const contactDetailsElement = document.createElement('div');
	contactDetailsElement.classList.add('messageSectionDetails');

	const nameElement = document.createElement('p');
	nameElement.innerHTML = 'Name: ';
	const nameDetail = document.createElement('span');
	nameDetail.innerHTML = userMessage['contactName'];
	nameElement.appendChild(nameDetail);

	const phoneElement = document.createElement('p');
	phoneElement.innerHTML = 'Phone: ';
	const phoneDetail = document.createElement('span');
	phoneDetail.innerHTML = userMessage['phoneNumber'];
	phoneElement.appendChild(phoneDetail);

	const emailElement = document.createElement('p');
	emailElement.innerHTML = 'Email: ';
	const emailDetail = document.createElement('span');
	emailDetail.innerHTML = userMessage['emailAddress'];
	emailElement.appendChild(emailDetail);

	contactDetailsElement.appendChild(nameElement);
	contactDetailsElement.appendChild(phoneElement);
	contactDetailsElement.appendChild(emailElement);

	const messageDetailsElement = document.createElement('div');
	messageDetailsElement.classList.add('messageSectionDetails');

	const typeElement = document.createElement('p');
	typeElement.innerHTML = 'Mesage Type: ';
	const typeDetail = document.createElement('span');
	typeDetail.innerHTML = userMessage['contactType'];
	typeElement.append(typeDetail);

	const timeElement = document.createElement('p');
	timeElement.innerHTML = 'Timestamp: ';
	const timeDetail = document.createElement('span');
	timeDetail.innerHTML = userMessage['messageDate'];
	timeElement.appendChild(timeDetail);

	messageDetailsElement.appendChild(timeElement);
	messageDetailsElement.appendChild(typeElement);

	// append elements
	messageContainerElement.appendChild(contactDetailsElement);
	messageContainerElement.appendChild(messageDetailsElement);
	messageContainerElement.appendChild(messageTypeElement);
	messageContainerElement.appendChild(contentElement);

	document.getElementById('siteContent').appendChild(messageContainerElement);
}

document.addEventListener('DOMContentLoaded', function() {
	setActiveLinkElement();
	setupAboutPage();
	setupMessageConfirmPage();
});