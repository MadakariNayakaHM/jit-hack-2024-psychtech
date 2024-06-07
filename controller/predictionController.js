const { spawn } = require('child_process');
const serverData = require("../models/serverDataModel");
const moment = require('moment');
const path = require('path');
//function split the recevied data from python script into modelMetrics, predictionsData
function splitOutput(output) {
    let modelMetrics = '';
    let predictionsData = '';
    let isModelMetrics = false;
    const lines = output.split('\n');
    for (const line of lines) {
        if (line.startsWith("Model for")) {
            // Model evaluation metrics
            isModelMetrics = true;
        } else if (line.startsWith("{")) {
            // Prediction results
            isModelMetrics = false;
        }

        if (isModelMetrics) {
            modelMetrics += line + '\n';
        } else {
            predictionsData += line + '\n';
        }
    }
    return [modelMetrics.trim(), predictionsData.trim()];
}

exports.predictions = async (req, res) => {
    const id = '654b4c3f42782e08d6a9af5e';
    const datas = await serverData.findById(id);
    //this json data where we pass as parameter in spawn funtion ,it contain input  data  for prediction
    const predict = JSON.stringify([{
        dataName: 'temparature',
        interval: '500',
        number: '10'
    },
    {
        dataName: 'pressure',
        interval: '100',
        number: '10'
    },
    {
        dataName: 'humidity',
        interval: '600',
        number: '10'
    },
    ]);
    const datase = datas.data[0].variableNode;
    // converting the timeStamp into this format ddd MMM DD YYYY HH:mm:ss (2023-11-30 11:21:07)
    for (let i = 0; i < 3; i++) {
        datase[i].dataSource.forEach(entry => {
            entry.timeStamp = moment(entry.timeStamp, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format('YYYY-MM-DD HH:mm:ss');
        });
    }
    //this the data for traing the model
    const dataValue = JSON.stringify(datase);
    try {
        //here we specifyting the python script along with passing the two arguments
        //running child process
        const scriptPath = path.join(__dirname, '..', 'pythonScripts', 'new7.py');
        const python = spawn('python', [scriptPath, dataValue, predict]);
        let pythonOutput = '';
        //here we captureing the data printed on python script
        python.stdout.on('data', function (data) {
            // Now pythonOutput contains the entire output
            pythonOutput += data.toString();
        });
        // Handle errors during the execution of the Python script
        python.stderr.on('data', function (data) {
            console.error('Error from Python script:', data.toString());
        });
        // Handle the closure of the child process
        python.on('close', (code) => {
            //0=success, 1=error
            console.log(`Child process closed with code ${code}`);
            if (code === 0) {
                console.log("The process exited successfully");
                //  split it into modelMetrics and predictionsData
                const [modelMetrics, predictionsData] = splitOutput(pythonOutput);
                console.log("Model Metrics:", modelMetrics);
                const predictions = JSON.parse(predictionsData);
                // Loop through the predictions object
                predictions.predictions.forEach(predictionData => {
                    console.log(`Data Name: ${predictionData.dataName}`);

                    console.log("Data and Timestamps:");
                    for (let i = 0; i < predictionData.predictions.length; i++) {
                        const prediction = predictionData.predictions[i];
                        const timestamp = predictionData.timestamps[i];
                        console.log(`  ${prediction} - ${timestamp}`);
                    }
                    console.log("\n");
                });
                res.status(200).json({
                    status: "sucess",
                    data: {
                        data: predictions
                    }
                })
            } else {

                // The process exited with an error
                console.log("Error occurred");
                res.status(500).json({
                    status: "failed",

                })
            }
        });
    } catch (err) {
        console.log(err);
    }
};
