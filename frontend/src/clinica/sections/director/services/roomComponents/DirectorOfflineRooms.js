import React from 'react'

function DirectorOfflineRooms() {
  return (
    <input
        style={{ minWidth: "70px" }}
        name="type"
        // value={room.type && room.type}
        // onKeyUp={keyPressed}
        // onChange={inputHandler}
        type="text"
        className="form-control w-100"
        id="type"
        placeholder={"Some input here"}
      />
  )
}

export default DirectorOfflineRooms