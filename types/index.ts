import { KeyboardTypeOptions } from "react-native";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ContactList: undefined;
    Dashboard: User;
    AddTransaction: User;
};

export type InputProps = {
    error?: string|null,
    placeholder?: string,
    value?: string,
    onChangeText?: ((text: string) => void) | undefined,
    secureTextEntry?: boolean,
    type?: KeyboardTypeOptions
}

export type Contact = {
    id: number;
    contactName: string;
    contactTel: string;
};

export type User = {
    userId: number;
    userName: string,
    email: string;
    password: string;
}

export type Transactions = {
    id: number;
    user_id: number;
    amount: number;
    type: "income"|"expense";
    category: string;
    note: string;
    date: string;
}