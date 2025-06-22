import { KeyboardTypeOptions } from "react-native";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ContactList: undefined;
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