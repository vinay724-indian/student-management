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
                bat '"C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t student-management-app:latest .'
            }
        }
        stage('Run Container') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    bat '"C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" stop student-app'
                    bat '"C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" rm student-app'
                }
                bat '"C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" run -d -p 3000:3000 --name student-app student-management-app:latest'
            }
        }
    }
}