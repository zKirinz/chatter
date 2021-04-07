class Users {
  constructor() {
    this.listOfUsers = [];
  }

  addUser(id, name, room) {
    const user = {id, name, room};
    this.listOfUsers.push(user);
  }

  getUserById(id) {
    const user = this.listOfUsers.filter((user) => user.id === id)[0];
    return user;
  }

  removeUserById(id) {
    const user = this.getUserById(id);
    const usersList = this.listOfUsers.filter((user) => user.id !== id);
    this.listOfUsers = usersList;
    return user;
  }

  getListofUsersInRoom(room) {
    const usersList = this.listOfUsers.filter((user) => user.room === room);
    return usersList;
  }
}

module.exports = {
  Users,
};
