# Simulation Exercise (Node-RED-Firebase-JS) 

- Simulate a live time series voltage & temperature data stream from [Node-RED](https://nodered.org).
- Push the said data stream from Node-RED to [Google Firebase Realtime Database](https://firebase.google.com/docs/database) using any HTTP client in Node-RED.
- The data stored in Firebase needs to have the following structure:

   - **Voltage**: 
     
     The `key` for the stored json data should be the epoch at which the data was generated and the voltage
     `value` generated at that time.
    
     ```ts
     interface Voltage {
         [timestamp: string]: number;
     }
     ```

     Example:

     ```json
     {
         "1663306125368": 35,
         "1663306125390": 32
     }
     ```

  - **Temperature**:

    The `key` for the stored json data should be the epoch at which the data was generated and the temperature
    `value` generated at that time.

    ```ts
    interface Temperature {
        [timestamp: string]: number;
    }
    ```

    Example:

    ```json
    {
        "1663306125368": 27,
        "1663306125390": 21
    }
    ```

- Once the data starts coming into Firebase, keep fetching it in your app and plot following live charts:
  1. Realtime data of voltage and temperature in one graph.
  2. Average data per 3 minutes of voltage.
  3. Average data per 3 minutes of Temperature.

### Initial Readings:

- [Node-RED: Fundamentals - YouTube tutorial](https://www.youtube.com/watch?v=3AR432bguOY) (To get overview about Node-RED)
- [Node-RED: Creating your first flow](https://nodered.org/docs/tutorials/first-flow)
- [Node-RED: Concepts](https://nodered.org/docs/user-guide/concepts)
- [Node-RED: Editor guide](https://nodered.org/docs/user-guide/editor)
- [Node-RED: Core nodes](https://nodered.org/docs/user-guide/nodes)
- [Firebase & Node-RED: How to integrate?](https://mkt-sampath97.medium.com/connect-iot-system-with-firebase-realtime-database-891114b1b9e5)

## Prerequisite

[Control plot exercise](https://github.com/noovosoft/javascript-exercises)
