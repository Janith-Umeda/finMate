import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import getDB from 'lib/db';
import { RootStackParamList, Transactions } from 'types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function DashboardScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'Dashboard'>>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const [totals, setTotals] = useState({ income: 0, expense: 0 });

    const loadData = useCallback(async () => {

        const db = await getDB();
        const results = await db.getAllAsync(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
            [route.params.userId]
        ) as Transactions[];

        const list: Transactions[] = [];
        let income = 0;
        let expense = 0;

        results.forEach((tx) => {
            if (tx.type === 'income') {
                income += tx.amount;
            } else {
                expense += tx.amount;
            }
            list.push(tx);
        })

        setTransactions(list);
        setTotals({ income, expense });
    }, [route?.params.userId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation, loadData]);

    return (
        <View className="flex-1 bg-white py-16 px-5">
            <View className='flex flex-row items-center justify-between mb-2'>
                <View className='flex flex-row items-center gap-2'>
                    <Image
                        source={require('../../assets/images/finmate-logo-tp.png')}
                        className="size-10 self-start"
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-bold text-green-600">Dashboard</Text>
                </View>
                <Text className="text-xl font-semibold">Hi {route.params.userName}!</Text>
            </View>
            <Text className="text-base italic text-gray-500 mb-5">Your Money, Simplified.</Text>
            <View className="bg-gray-100 rounded-lg p-4 mb-4">
                <Text className="text-lg font-semibold">Balance</Text>
                <Text className="text-xl font-bold text-gray-800">
                    Rs. {totals.income - totals.expense}
                </Text>
                <View className="flex-row justify-between mt-2">
                    <Text className="text-green-500">Income: Rs. {totals.income}</Text>
                    <Text className="text-red-500">Expense: Rs. {totals.expense}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("AddTransaction", route.params)}
                className="bg-green-600 py-3 rounded-lg mb-4"
            >
                <Text className="text-white text-center text-lg font-semibold">+ Add Transaction</Text>
            </TouchableOpacity>

            <Text className="text-lg font-semibold mb-2">Recent Transactions</Text>
            <ScrollView className="space-y-3">
                {transactions.slice(0, 5).map(tx => (
                    <TransactionRow 
                        key={tx.id}
                        transaction={tx}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

function TransactionRow({transaction}:{transaction:Transactions}) {
    return <View
        key={transaction.id}
        className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex-row justify-between mb-3"
    >
        <Text className="capitalize">{transaction.category} ({transaction.type})</Text>
        <Text className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            Rs. {transaction.amount}
        </Text>
    </View>
}