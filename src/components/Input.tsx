import { Text, TextInput, View } from 'react-native';
import { InputProps } from 'types';



export default function Input({error, placeholder, value, onChangeText, secureTextEntry, type}:InputProps) {
    return (<View className='mb-4'>
        <TextInput
            className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            secureTextEntry={secureTextEntry}
            keyboardType={type}
        />
        {error ? (
            <Text
                className='text-red-500 font-semibold text-lg py-0.5'
            >
                {error}
            </Text>
        ) : null}
    </View>
    );
}
