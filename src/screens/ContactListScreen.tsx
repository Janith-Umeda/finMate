import getDB from "lib/db";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Contact } from "types";
import Input from "~/components/Input";

export default function ContactListScreen() {
    const [contactName, setContactName] = useState<string | undefined>(undefined);
    const [contactNo, setContactNo] = useState<string | undefined>(undefined);
    const [contactsData, setContactsData] = useState<Contact[]>([]);
    const [editContact, setEditContact] = useState<Contact | null>(null);

    const handleContactAdd = async () => {
        if (!contactName || !contactNo) {
            Alert.alert('Error', 'All Fields are required!')
            return;
        }
        const db = await getDB();
        try {
            const res = await db.runAsync(
                `INSERT INTO contacts (contactName, contactTel) VALUES (?,?)`,
                [contactName, contactNo]
            );
            if (!res.changes) {
                return;
            }
            Keyboard.dismiss();
            setContactName(undefined);
            setContactNo(undefined);
            fetchContacts();
        } catch (error) {
            console.error('handleContactAdd : ', error);
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

    const makeACall = (contact: Contact) => {
        const phoneNumber = contact.contactTel;
        const url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch(err => {
            Alert.alert('Error', 'Unable to make a call');
            console.error('makeACall:', err);
        });
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
            {contactsData.length > 0 ? (
                <ScrollView className="max-h-96 mt-3">
                    <View className="flex gap-4">
                        {contactsData.map((c, _) => (
                            <TouchableOpacity
                                onPress={() => { makeACall(c) }}
                                key={c.id}
                                className="border border-gray-300 rounded py-2 px-3 shadow bg-white flex flex-row items-center justify-between"
                            >
                                <View>
                                    <Text className="text-2xl text-gray-800">{c.contactName}</Text>
                                    <Text className="text-3xl mt-2">{c.contactTel}</Text>
                                </View>
                                <View className="flex flex-row items-center gap-2">
                                    <TouchableOpacity
                                        onPress={() => setEditContact(c)}
                                        className="bg-yellow-500 py-3 rounded-lg w-16"
                                    >
                                        <Text className="text-white text-center text-lg font-semibold">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleContactDelete(c.id)}
                                        className="bg-red-600 py-3 rounded-lg w-16"
                                    >
                                        <Text className="text-white text-center text-lg font-semibold">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View className="py-10">
                    <Text className="text-center font-medium">No Contacts saved yet.</Text>
                </View>
            )}
            <ContactEditModal selectedContact={editContact} setEditContact={setEditContact} fetchContacts={fetchContacts} />
        </View>
    </>
}

type ContactEditModalProps = {
    selectedContact: Contact | null;
    setEditContact: React.Dispatch<React.SetStateAction<Contact | null>>;
    fetchContacts: () => void
}

function ContactEditModal({ selectedContact, setEditContact, fetchContacts }: ContactEditModalProps) {
    const [contactName, setContactName] = useState("");
    const [contactTel, setContactTel] = useState("");

    useEffect(() => {
        setContactName(selectedContact?.contactName || "");
        setContactTel(selectedContact?.contactTel || "");
    }, [selectedContact?.contactName, selectedContact?.contactTel]);

    const handleSave = async () => {
        if (!selectedContact?.id) {
            return;
        }

        if (!contactName || !contactTel) {
            Alert.alert('Error', 'All Fields are required!')
            return;
        }
        const db = await getDB();
        try {
            const res = await db.runAsync(
                `UPDATE contacts SET contactName = ?, contactTel = ? WHERE id = ?`,
                [contactName, contactTel, selectedContact.id]
            );

            if (!res.changes) {
                return;
            }
            Keyboard.dismiss();
            setEditContact(null);
            fetchContacts()
        } catch (error) {
            Alert.alert('Error', `Failed to update ${contactName}!`)
            console.error('handleContactAdd : ', error);
        }
    }

    return <View className={`absolute h-screen w-screen ${selectedContact ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <View className="w-3/4 h-auto bg-white rounded-md shadow-md flex flex-col justify-between">
            <View className="border-b border-b-black/20 px-5 py-4">
                <Text className="text-2xl font-semibold">
                    Edit Contact: {selectedContact?.contactName}
                </Text>
            </View>
            <View className="px-5 mt-8 text-lg">
                <Input
                    value={contactName}
                    onChangeText={setContactName}
                />
                <Input
                    value={contactTel}
                    onChangeText={setContactTel}
                    type="number-pad"
                />
            </View>
            <View className="w-full flex flex-row items-center justify-between p-4">
                <TouchableOpacity
                    onPress={() => setEditContact(null)}
                    className="bg-gray-500 py-3 rounded-lg w-32"
                >
                    <Text className="text-white text-center text-lg font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-600 py-3 rounded-lg w-32"
                    onPress={handleSave}
                >
                    <Text className="text-white text-center text-lg font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}