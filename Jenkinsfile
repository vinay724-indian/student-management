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
                bat 'npm install'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-management-app:latest .'
            }
        }
        stage('Run Container') {
            steps {
                // Ignore errors if the container doesn't exist yet
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    bat 'docker stop student-app'
                    bat 'docker rm student-app'
                }
                bat 'docker run -d -p 3000:3000 --name student-app student-management-app:latest'
            }
        }
    }
}