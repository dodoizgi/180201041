import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    Image,
    StatusBar,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'react-native-image-picker';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';


const App: () => React$Node = () => {

    const [response, setResponse] = React.useState(null);
    //sonuc
    const [sonuctext, setsonuctext] = React.useState(" ");
    //storage e yollanacak dosyanin ismi ve turu ayarlanir
    const reference = storage().ref('dosya.png');
    let sonuStringi = '';

    const visionayolla = async () => {
        try {

            //fotografin hangisinin oldugunun belirtildigi ayrıca fotografin hangi turde incelenecegini belirlenen yer
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            {type: 'OBJECT_LOCALIZATION', maxResults: 5},
                        ],
                        image: {
                            source: {
                                imageUri: 'gs://myreact-601ac.appspot.com/dosya.png',
                            },
                        },
                    },
                ],
            });
            //kendi apimizin keyinin girildigi yer
            let response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDUNUHLBqrpyMrd0Lt86HkHAZnuxACTSwE',

                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: body,
                },
            );

            //apinin gonderdigi urunlerin sırayla ekrana yazdırilmasi icin string dizisine atıldigi yer
            sonuStringi=""
            let responseJson = await response.json();
            //consol islemi
            console.log(responseJson);
            let i=0;
            let sonuclar = responseJson.responses[0].localizedObjectAnnotations;

            for (i = 0; i < sonuclar.length; i++) {
                sonuStringi += sonuclar[i].name + "\n";

            }
            setsonuctext(sonuStringi)

            //boundingPoly ile consolda yerlerini gosterilen yer
            console.log(responseJson.responses[0].localizedObjectAnnotations[0].boundingPoly);


        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <SafeAreaView>
                <ScrollView>



                    <Button color = '#FA1CBE'
                        title="upload"
                        onPress={async () => {
                            // path to existing file on filesystem
                            const pathToFile = response.uri;
                            // uploads file
                            await reference.putFile(pathToFile);
                        }}
                    />


                    <Button color = '#FA1CBE'
                            title="Select image"
                            onPress={() =>
                                ImagePicker.launchImageLibrary(
                                    {
                                        mediaType: 'photo',
                                        includeBase64: false,
                                        maxHeight: 200,
                                        maxWidth: 200,
                                    },
                                    (response) => {
                                        setResponse(response);
                                    },
                                )
                            }
                    />

                    <Button color = '#FA1CBE'
                        title="Take image"
                        onPress={() =>
                            ImagePicker.launchCamera(
                                {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    quality: 0.8,
                                    maxHeight: 200,
                                    maxWidth: 200

                                },
                                (response) => {
                                    setResponse(response);
                                },
                            )
                        }
                    />

                    <Button color = '#FA1CBE'

                            title="nesne tespit et"
                            onPress={
                                visionayolla
                            }
                    />

                    {response && (
                        <View style={styles.image}>
                            <Image
                                style={{width: 200, height: 200}}
                                source={{uri: response.uri}}
                            />
                        </View>
                    )}


                    <Text style={{ fontSize: 20 }}>                          {sonuctext}</Text>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        marginVertical: 24,
        marginHorizontal: 24,
        backgroundColor: '#FA1CBE'
    },
    image: {
        marginVertical: 24,
        alignItems: 'center',
    },
    response: {
        marginVertical: 16,
        marginHorizontal: 8,
    },
});

export default App;

