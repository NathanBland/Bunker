Bunker
======

A contact list built to keep your contacts 
**[Preview!](https://preview.c9.io/nathanbland/bunker/index.html)**

Project Description
-------------------
The project is a perosnal contact manager. It will allow you to store contacts, sort by first or last name, and search. 

Each **contact** has the following properties:

- id - A Number representing the system-generated unique identifier.
- firstName - A String representing the first name of the contact.
- lastName - A String representing the last name of the contact.
- birthday - A Date representing the birthday of the contact.
- phoneNumbers - An array of Phone objects of the contact.
- address - An array of Address objects of the contact.
- avatar - A String containing the path to the image of the contact. If none is provided, the default.png is used.

Each **Phone** has the following properties:
- id - A Number representing the system-generated unique identifier.
- phoneNumber - A Number representing a phone number of a specified type.
- type - A String representing what kind of number the Phone object is, such as "Cell", or "Home".

Each **Address** has the following properties:
- id - A Number representing the system-generated unique identifier.
- desc - A String representing the type/location of the Address object. ("home", "work", "school")
- street - A String representing the number and street of the address.
- city - A string representing the city of the Address object.
- state - A string representing the state of the Address. Usually a two-letter abbreviation. 
- zip - A Number representing the postal code of the Address.

*Possible* future properties:

- relation - A String representing the connection to the person e.g., "Brother", "cousin".
- socialProfiles - An Array of Profile objects representing a connection to a social profile: Facebook, Skype, etc.
- categories - A String declaring an affiliation to a specific group of contacts e.g., "favorites", "Family"

*Possible* future features:
- Export/import - upload a csv, or vCard file to import contacts, or export back out to either of those file types.
- Multiple photos - Allow a rotation of photos per contact.
- Smart Category - Build categories based on lookup usage, and/or relation.  