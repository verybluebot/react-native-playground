import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from 'react-native';


export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            task: '',
            completed: [],
        }
    }

    componentDidUpdate() {
        this.setStorage();
    }

    componentWillMount() {
        AsyncStorage.getItem('tasks').then((res) => {
            if (JSON.parse(res) === null) return;
            this.setState({tasks: JSON.parse(res)})
        });

        AsyncStorage.getItem('completedTasks').then((res) => {
            if (JSON.parse(res) === null) return;

            this.setState({completed: JSON.parse(res)})
        })
    }

    renderList(tasks) {
        return (
            tasks.map((t, i) => {
                return (
                    <View key={t} style={styles.task}>
                        <Text>
                            {t}
                        </Text>
                        <TouchableOpacity onPress={() => this.setCompleteTask(i)}>
                            <Text>
                                &#10003;
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
    }

    renderCompletedTasks(tasks) {
        return (
            tasks.map((t, i) => {
                return (
                    <View key={t} style={styles.task}>
                        <Text style={styles.completedTask}>
                            {t}
                        </Text>
                        <TouchableOpacity onPress={() => this.deleteTask(i)}>
                            <Text>
                                &#10005;
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        )
    }

    setStorage() {
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
        AsyncStorage.setItem('completedTasks', JSON.stringify(this.state.completed));
    }

    deleteTask(index) {
        let compleatedTasks = this.state.completed;
        compleatedTasks = compleatedTasks.slice(0, index).concat(compleatedTasks.slice(index + 1));

        this.setState({completed: compleatedTasks});
    }

    setCompleteTask(index) {
        let tasks = this.state.tasks;

        tasks = tasks.slice(0, index).concat(tasks.slice(index + 1));

        let completed = this.state.completed;
        completed = completed.concat([this.state.tasks[index]]);

        this.setState({
            tasks: tasks,
            completed: completed
        });

    }

    addTask() {
        if (this.task === '') return;
        let tasks = this.state.tasks.concat([this.state.task]);
        this.setState({tasks: tasks});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>
                    This is total shit!!!
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='Give me your best try...'
                    onChangeText={(text) => {
                        this.setState({task: text});
                    }}
                    onEndEditing={() => {
                        this.addTask();
                    }}
                />
                <ScrollView>
                    {this.renderList(this.state.tasks)}
                    {this.renderCompletedTasks(this.state.completed)}
                </ScrollView>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        textAlign: 'center',
        margin: 30,
        marginTop: 50,
        fontSize: 18
    },
    input: {
        margin: 10,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        height: 60,
    },
    task: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10
    },
    completedTask: {
       color: '#555',
        textDecorationLine: 'line-through'
    }
});