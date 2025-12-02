pipeline {
    agent any

    environment {
        SSH_USER   = "root"
        SSH_HOST   = "159.89.172.251"
        REMOTE_DIR = "/www/wwwroot/CITSNVN/attendance/reactFronted"
        NODE_VERSION = "22.14.0"
        PORT       = "3082"
        NVM_DIR    = "${WORKSPACE}/.nvm"
    }

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy to server?')
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Verify Credentials') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'DO_SSH_PASSWORD',
                                     usernameVariable: 'SSH_USER_VAR',
                                     passwordVariable: 'SSH_PASS')
                ]) {
                    echo "🟢 Credentials OK for $SSH_USER_VAR"
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Node via NVM') {
            steps {
                sh '''
                    echo "📦 Installing Node ${NODE_VERSION}"
                    export NVM_DIR="${NVM_DIR}"
                    mkdir -p "$NVM_DIR"
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    . "$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    . "${NVM_DIR}/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm ci
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    . "${NVM_DIR}/nvm.sh"
                    nvm use ${NODE_VERSION}
                    CI=false npm run build
                '''
            }
        }

        stage('Archive Build') {
            steps {
                sh 'tar czf build.tar.gz -C build .'
            }
        }

        stage('Deploy to VPS') {
            when { expression { params.DEPLOY } }
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'DO_SSH_PASSWORD',
                                     usernameVariable: 'SSH_USER_VAR',
                                     passwordVariable: 'SSH_PASS')
                ]) {
                    script {
                        echo "🔐 Deploying to VPS..."

                        // Kill existing process on the port
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST \
                            "lsof -t -i:${PORT} | xargs -r kill -9 || true"
                        '''

                        // Backup current build
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST \
                            "cd ${REMOTE_DIR} && rm -rf build.bak && mv build build.bak 2>/dev/null || true"
                        '''

                        // Copy build archive to server
                        sh '''
                            sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no \
                            build.tar.gz $SSH_USER@$SSH_HOST:${REMOTE_DIR}/
                        '''

                        // Extract build archive
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST \
                            "cd ${REMOTE_DIR} && rm -rf build && mkdir build && tar xzf build.tar.gz -C build"
                        '''

                        // Start application with serve
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST \
                            "cd ${REMOTE_DIR}/build && nohup npx serve -s . -l ${PORT} > serve.log 2>&1 &"
                        '''

                        // Verify deployment
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST \
                            "[ -d ${REMOTE_DIR}/build ] && echo '✅ Deployment Success' || echo '❌ Deployment Failed'"
                        '''
                    }
                }
            }
        }
    }

    post {
        success { 
            echo "✅ React Deployment Completed Successfully!"
        }
        failure { 
            echo "❌ Deployment Failed!"
        }
        cleanup {
            cleanWs()
        }
    }
}