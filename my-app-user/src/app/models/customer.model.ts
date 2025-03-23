

/**  Customer Model */
export interface Customer {
  _id: any;
  id: string;
  first_name: string; // Dữ liệu từ API
  last_name: string;
  email: string;
  phone_number?: string;
  avatar?: string;
  address_array: Address[]; // Ensure this property exists
}

/**  Address Interface */
export interface Address {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

/**  Address Model - With Default Values */
export class AddressModel implements Address {
  first_name = '';
  last_name = '';
  phone_number = '';
  address = '';

  constructor(data?: Partial<Address>) {
    Object.assign(this, data);
  }
}

/**  Address Update Request */
export interface AddressUpdateRequest {
  action: 'add' | 'update' | 'delete';
  index?: number; // Needed for update & delete
  new_address?: Address; // Always provide for 'add' & 'update'
}
