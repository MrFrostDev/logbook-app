import {Button, StyleSheet, View, Text, ToastAndroid} from "react-native";
import Tour from "../../model/Tour";
import {tours as tourList, updateTourList} from "../../api/tourManagement";
import {useEffect, useState} from "react";

export default function Tourlist({
                                     currentTour,
                                     setCurrentTour
                                 }: { currentTour: Tour | undefined, setCurrentTour: (tour: Tour | undefined) => void }) {
    const [tours, setTours] = useState<Tour[]>(tourList);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric"
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updateTourList("testUser").then(r => {
                ToastAndroid.show("Tourlist updated", ToastAndroid.SHORT);
                setTours(tourList);
            }).catch(error => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            });
        }, 10000);
        return () => clearInterval(interval);
    },[]);

    function LoadTour(selectedTour: Tour) {//loads selected Tour after pressing the tourbutton
        setCurrentTour(selectedTour);
    }

    return (
        <View style={styles.tourlistContainer}>
            {currentTour ? (
                <View>
                    <Button
                        title={"back"}
                        onPress={() => setCurrentTour(undefined)}
                    />

                    <Text> {"Tour ID: " + currentTour.tourId} </Text>
                    <Text> {"User ID: " + currentTour.userId} </Text>
                    <Text> {"Coordinates: " + currentTour.waypoints[0].getLatitude() + ", " + currentTour.waypoints[0].getLongitude() + " - " + currentTour.waypoints[currentTour.waypoints.length - 1].getLatitude() + ", " + currentTour.waypoints[currentTour.waypoints.length - 1].getLongitude()} </Text>
                    <Text> {"Time: " + new Date(currentTour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options) + " - " + new Date(currentTour.waypoints[currentTour.waypoints.length - 1].getTimestamp()).toLocaleDateString("de-DE", options)} </Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.headline}>Tours: </Text>
                    {
                        tours.map((tour, index) => {
                            let date1 = new Date(tour.waypoints[0].getTimestamp()).toLocaleDateString("de-DE", options)
                            let date2 = new Date(tour.waypoints[tour.waypoints.length - 1].getTimestamp()).toLocaleDateString("de-DE", options)
                            return (
                                <Button
                                    key={index}
                                    title={date1 + " - " + date2}
                                    onPress={() => {
                                        LoadTour(tour)
                                    }}
                                />
                            )

                        })
                    }
                </View>
            )}
        </View>
    )


}


const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
