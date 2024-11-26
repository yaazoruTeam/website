interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    id_number: string;
    phone_number: string;
    additional_phone: string;
    email: string;
    city: string;
    address1: string;
    address2: string;
    zipCode: string
}

function sanitize(customer: Customer): Customer {
    const isString = (value: any) => typeof value === 'string';
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhoneNumber = (phone: string) =>
        /^\d{9,15}$/.test(phone);

    if (customer.id && !isString(customer.id))
        throw new Error('Invalid or missing "id".');
    if (!isString(customer.first_name) || customer.first_name.trim() === '')
        throw new Error('Invalid or missing "first_name".');
    if (!isString(customer.last_name) || customer.last_name.trim() === '')
        throw new Error('Invalid or missing "last_name".');
    if (!isString(customer.id_number) || customer.id_number.trim() === '')
        throw new Error('Invalid or missing "id_number".');
    if (!isString(customer.phone_number) || !isValidPhoneNumber(customer.phone_number))
        throw new Error('Invalid or missing "phone_number". It must be a number between 9 and 15 digits.');
    if (customer.additional_phone && (!isString(customer.additional_phone) || !isValidPhoneNumber(customer.additional_phone)))
        throw new Error('Invalid or missing "additional_phone". It must be a number between 9 and 15 digits.');
    if (!isString(customer.email) || !isValidEmail(customer.email))
        throw new Error('Invalid or missing "email".');
    if (!isString(customer.city) || customer.city.trim() === '')
        throw new Error('Invalid or missing "city".');
    if (!isString(customer.address1) || customer.address1.trim() === '')
        throw new Error('Invalid or missing "address1".');
    if (customer.address2 && !isString(customer.address2))
        throw new Error('Invalid or missing "address2".');
    if (!isString(customer.zipCode) || customer.zipCode.trim() === '')
        throw new Error('Invalid or missing "zipCode".');

    const newCustomer: Customer = {
        id: customer.id,
        first_name: customer.first_name.trim(),
        last_name: customer.last_name.trim(),
        id_number: customer.id_number.trim(),
        phone_number: customer.phone_number.trim(),
        additional_phone: customer.additional_phone,
        email: customer.email.trim().toLowerCase(),
        city: customer.city.trim(),
        address1: customer.address1.trim(),
        address2: customer.address2,
        zipCode: customer.zipCode,
    };
    return newCustomer;
}
export { Customer, sanitize }