var Contact = {
    id: Number,
    firstName: String,
    lastName: String,
    birthday: Date,
    phoneNumbers: [Phone],
    address: [Address],
    avatar: String
}
var Phone = {
    id: Number,
    phoneNumber: Number,
    type: String
}
var Address = {
    id: Number,
    desc: String,
    street: String,
    city: String,
    state: String,
    zip: String
}