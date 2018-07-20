 public void S_FARM_CONSUME1(int idUnitInLocations, Vector3 PositionFrom, Vector3 PositionTo)//cancel seen mess priate
 {
    Dictionary<string, string> data = new Dictionary<string, string>();
    data["idUnitInLocations"] = idUnitInLocations.ToString();
    string positionFrom = PositionFrom.x + "," + PositionFrom.z;
    data["PositionFrom"] = positionFrom;
    string positionTo = PositionTo.x + "," + PositionTo.z;
    data["PositionTo"] = positionTo;

    SystemSocketEvent.instance.SocketIO.Emit("S_FARM_CONSUME", new JSONObject(data));
    Debug.Log("S_FARM_CONSUME" + new JSONObject(data));

}