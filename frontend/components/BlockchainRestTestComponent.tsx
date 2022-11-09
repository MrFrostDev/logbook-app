import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useState} from "react";

export default function BlockchainRestTestComponent() {
    const [input, setInput] = useState("");
    const [blockchain, setBlockchain] = useState("");

    function handleInput(event: any) {
        setInput(event.target.value);
    }

    function post() {
        fetch('http://localhost:8080/tour-app/write/test/' + input)
    }

    function get() {
        fetch('http://localhost:8080/tour-app/test')
            .then(response => response.json())
            .then(data => setBlockchain(data))
    }

    return (
        <View style={styles.container}>
            <Text>{blockchain}</Text>
            <TextInput onTextInput={handleInput} placeholder="Enter a test string"/>
            <Button onPress={post} title={'Post to Blockchain'}/>
            <Button onPress={get} title={'Retrieve from Blockchain'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
