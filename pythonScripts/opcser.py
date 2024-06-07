from opcua import Client

# Replace this with your OPC-UA server endpoint URL
endpoint_url = "opc.tcp://127.0.0.1:4845/freeopcua/server1/"

# Create a client and connect to the server
client = Client(endpoint_url)
client.connect()

try:
    # Get the root node of the server
    root_node = client.get_root_node()

    # Print the browse names and node IDs of child nodes under the root node
    print("Child Nodes under Root Node:")
    for child_node in root_node.get_children():
        print("Browse Name:", child_node.get_browse_name().Name)
        print("Node ID:", child_node.nodeid)

finally:
    # Disconnect from the server
    client.disconnect()

