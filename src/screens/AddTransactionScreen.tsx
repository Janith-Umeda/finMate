import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from 'types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import getDB from 'lib/db';

export default function AddTransactionScreen(){
    const route = useRoute<RouteProp<RootStackParamList, 'AddTransaction'>>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleTransactionAdd = async () => {
        if (!amount || !category) {
            Alert.alert('Error', 'Amount and category are required.');
            return;
        }

        try {
            const db = await getDB();
            await db.runAsync(
                `INSERT INTO transactions (user_id, amount, type, category, note, date)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [route.params.userId, parseFloat(amount), type, category, note, date.toISOString()]
            );

            Alert.alert('Success', 'Transaction added');
            navigation.goBack();
        } catch (err) {
            console.error('handleTransactionAdd: ', err);
            Alert.alert('Error', 'Failed to add transaction');
        }
    };

    return (
        <View className="flex-1 bg-white py-16 px-5">
            <Text className="text-2xl font-bold text-green-600 mb-4">Add Transaction</Text>

            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                placeholder="Amount (Rs)"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
            />

            <View className="flex-row justify-around mb-3">
                <TouchableOpacity
                    className={`px-4 py-2 rounded-full border ${type === 'income' ? 'bg-green-600' : 'bg-white'
                        }`}
                    onPress={() => setType('income')}
                >
                    <Text className={type === 'income' ? 'text-white' : 'text-green-600'}>Income</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full border ${type === 'expense' ? 'bg-red-600' : 'bg-white'
                        }`}
                    onPress={() => setType('expense')}
                >
                    <Text className={type === 'expense' ? 'text-white' : 'text-red-600'}>Expense</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                placeholder="Category (e.g. Food, Bills)"
                value={category}
                onChangeText={setCategory}
            />

            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                placeholder="Note (optional)"
                value={note}
                onChangeText={setNote}
            />

            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            >
                <Text>{date.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            <TouchableOpacity onPress={handleTransactionAdd} className="bg-green-600 py-3 rounded-lg">
                <Text className="text-white text-center text-lg font-semibold">Add Transaction</Text>
            </TouchableOpacity>
        </View>
    );
};
