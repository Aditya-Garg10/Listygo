pipeline {
  agent any

  stages {
    stage('Pull Code') {
      steps {
        git branch: 'adi-be', url: 'https://github.com/Aditya-Garg10/Listygo.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t home-backend ./Listygo'
      }
    }

    stage('Redeploy') {
      steps {
        sh '''
          docker stop home-backend-1 || true
          docker rm home-backend-1 || true
          docker run -d --name home-backend-1 -p 8000:3000 home-backend
        '''
      }
    }
  }
}
