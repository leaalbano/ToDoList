package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/rs/cors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Task struct {
	ID        string    `json:"id,omitempty" bson:"_id,omitempty"`
	Title     string    `json:"title" bson:"title"`
	Status    string    `json:"status" bson:"status"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
}

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://254PROJECT:WPEXWKiKSOZFpEaF@cluster0.vojh42b.mongodb.net/?retryWrites=true&w=majority"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Proceed with setting up your API routes
	http.Handle("/createTask", cors.Default().Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		createTask(client, w, r)
	})))

	http.Handle("/getTasks", cors.Default().Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		getTasks(client, w, r)
	})))

	http.Handle("/deleteTask", cors.Default().Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		deleteTask(client, w, r)
	})))

	http.Handle("/updateTask", cors.Default().Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		updateTask(client, w, r)
	})))

	log.Fatal(http.ListenAndServe(":8080", nil))
}

// UpdateTask function
func updateTask(client *mongo.Client, w http.ResponseWriter, r *http.Request) {
	var task Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if the task ID is provided
	if task.ID == "" {
		http.Error(w, "Missing task ID", http.StatusBadRequest)
		return
	}

	// Connect to the collection
	collection := client.Database("todoDB").Collection("tasks")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	// Create a filter for the document to update
	filter := bson.M{"_id": task.ID}

	// Define the update
	update := bson.M{
		"$set": bson.M{
			"title":  task.Title,
			"status": task.Status,
			// You can add other fields here that you want to update
		},
	}

	// Update the task
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}

// Import necessary packages like "net/http", "encoding/json", etc.

func createTask(client *mongo.Client, w http.ResponseWriter, r *http.Request) {
	var task Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Set the CreatedAt field to the current time
	task.CreatedAt = time.Now()

	collection := client.Database("todoDB").Collection("tasks")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	result, _ := collection.InsertOne(ctx, task)

	json.NewEncoder(w).Encode(result)
}

func deleteTask(client *mongo.Client, w http.ResponseWriter, r *http.Request) {
	// Get the task ID from URL query parameter
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Missing task ID", http.StatusBadRequest)
		return
	}

	// Connect to the collection
	collection := client.Database("todoDB").Collection("tasks")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	// Delete the task
	result, err := collection.DeleteOne(ctx, bson.M{"_id": taskID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func getTasks(client *mongo.Client, w http.ResponseWriter, r *http.Request) {
	var tasks []Task
	collection := client.Database("todoDB").Collection("tasks")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var task Task
		cursor.Decode(&task)
		tasks = append(tasks, task)
	}

	json.NewEncoder(w).Encode(tasks)
}
