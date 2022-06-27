package com.example.demo;

public class User {
    private int id;
    private String name;
    private String surname;
    private boolean hasVisited;
    private Positions positions;

    public User(int id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        hasVisited = false;
        positions = new Positions();
    }

    public int getId() {
        return id;
    }

    public void setId(int i) {
        id = i;
    }

    public String getName() {
        return surname + " " + name;
    }

    public void setName(String n) {
        name = n;
    }

    public void setSurname(String s) {
        surname = s;
    }

    public boolean getHasVisited() {
        return hasVisited;
    }

    public void setHasVisited(boolean v) {
        hasVisited = v;
    }

    public Positions getPositions() {
        return positions;
    }
}