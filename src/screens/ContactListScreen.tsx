import getDB from "lib/db";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Contact } from "types";
import { Container } from "~/components/Container";
import Input from "~/components/Input";

export default function ContactListScreen() {
    const [contactName, setContactName] = useState<string | undefined>(undefined);
    const [contactNo, setContactNo] = useState<string | undefined>(undefined);
    const [contactsData, setContactsData] = useState<Contact[]>([]);

    const handleContactAdd = async () => {
        if (!contactName || !contactNo) {
            Alert.alert('Error', 'All Fields are required!')
            return;
        }
        const db = await getDB();
        try {
            const res = await db.runAsync(`INSERT INTO contacts (contactName, contactTel) VALUES (?,?)`, [contactName, contactNo]);
            if (!res.changes) {
                return;
            }
            setContactName(undefined);
            setContactNo(undefined);
            fetchContacts();
        } catch (error) {
            console.error(error);
        }
    }

    const handleContactDelete = async (id: number) => {
        const db = await getDB();
        try {
            const res = await db.runAsync(`DELETE FROM contacts WHERE id = ?`, [id]);
            if (res.changes) {
                fetchContacts();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchContacts = async () => {
        const db = await getDB();
        const contacts = await db.getAllAsync('SELECT * FROM contacts ORDER BY id DESC');
        setContactsData(contacts as Contact[]);
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    return <>
        <View className="flex-1 justify-center px-6">
            <Text className="text-3xl font-semibold text-center mb-5">Add Contacts</Text>
            <View className="">
                <Input
                    placeholder="Contact Name"
                    value={contactName}
                    onChangeText={setContactName}
                />
                <Input
                    placeholder="Telephone number"
                    value={contactNo}
                    onChangeText={setContactNo}
                    type="number-pad"
                />
                <TouchableOpacity
                    onPress={handleContactAdd}
                    className="bg-green-600 py-3 rounded-lg"
                >
                    <Text className="text-white text-center text-lg font-semibold">Add</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-2xl font-medium mt-10">Saved Contacts</Text>
            <ScrollView className="max-h-96 mt-3">
                <View className="flex gap-4">
                    {contactsData.map((c, _) => (
                        <View key={c.id} className="border border-gray-300 rounded py-2 px-3 shadow bg-white flex flex-row items-center justify-between">
                            <View>
                                <Text className="text-2xl text-gray-800">{c.contactName}</Text>
                                <Text className="text-3xl mt-2">{c.contactTel}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={()=>handleContactDelete(c.id)}
                                className="bg-red-600 py-3 rounded-lg w-16"
                            >
                                <Text className="text-white text-center text-lg font-semibold">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    </>
}