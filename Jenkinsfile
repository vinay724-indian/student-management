pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t student-management-app:latest .'
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker stop student-app || true'
                sh 'docker rm student-app || true'
                sh 'docker run -d -p 3000:3000 --name student-app student-management-app:latest'
            }
        }
    }
}