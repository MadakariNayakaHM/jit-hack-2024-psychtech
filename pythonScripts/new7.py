import json
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import sys


def train_and_predict():
    
    jsondata = json.loads(sys.argv[1])
    predictdata = json.loads(sys.argv[  
        2])

    # Create a dictionary to store models and evaluation metrics for each variable
    
    model_info = {}

    for variable_data in jsondata:
        
        variable_name = variable_data['dataName']
        
        
        df = pd.DataFrame(variable_data['dataSource'])

        df['timeStamp'] = pd.to_datetime(df['timeStamp'])


        target = 'dataValue'

        X = df[['timeStamp']].copy()  # Include 'timeStamp' and create a copy
        # Convert timeStamp to numeric representation (e.g., seconds since epoch)
        X.loc[:, 'timeStamp'] = (X['timeStamp'] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')  # Convert to seconds
        y = df[target]

        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model on the training set
        model = LinearRegression()
        model.fit(X_train, y_train)

        # Make predictions on the testing set
        predictions = model.predict(X_test)

        # Evaluate the model
        mse = mean_squared_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)

        model_info[variable_name] = {
            'model': model,
            'evaluation_metrics': {'Mean Squared Error': mse, 'R-squared': r2}
        }
        

    # Predict individual data points
    predictions_list = []

    for variable_data in predictdata:
        
        variable_name = variable_data['dataName']  
        interval = int(variable_data['interval'])
        number = int(variable_data['number'])

        current_time = datetime.now()
        new_data = []

        for i in range(number):
            prediction_time = current_time + timedelta(minutes=i * interval)
            new_data.append({
                "timeStamp": prediction_time
            })

        variable_predictions = {}

        model_info_entry = model_info.get(variable_name)
        if model_info_entry:
            model = model_info_entry['model']
            new_data_df = pd.DataFrame(new_data)
            new_data_df['timeStamp'] = (new_data_df['timeStamp'] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')  # Convert to seconds

            prediction = model.predict(new_data_df[['timeStamp']]) 
            
            variable_predictions["dataName"] = variable_name
            variable_predictions["predictions"] = prediction.tolist()
            variable_predictions["timestamps"] = new_data_df['timeStamp'].apply(
                lambda ts: datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
            ).tolist()

            predictions_list.append(variable_predictions)

    # Print model evaluation metrics
    for variable_name, model_info_entry in model_info.items():
        print(f"Model for {variable_name}:")
        for metric_name, metric_value in model_info_entry['evaluation_metrics'].items():
            print(f"{metric_name}: {metric_value}")
        print("\n")

    # Include model evaluation metrics in response_data
    for variable_name, model_info_entry in model_info.items():
        predictions_list_entry = next((item for item in predictions_list if item["dataName"] == variable_name), None)
        if predictions_list_entry:
            predictions_list_entry["evaluation_metrics"] = model_info_entry['evaluation_metrics']

    # Print prediction results
    response_data = {"predictions": predictions_list, "status": "predicted"}
    try:
        print(json.dumps(response_data))
    except Exception as e:
        print(f"An error occurred: {e}")

train_and_predict()
