pipeline {
    agent any

    environment {
        PROD_USER   = "root"
        PROD_HOST   = "159.89.172.251"
        REMOTE_DIR  = "/www/wwwroot/CITSNVN/attendance/reactFronted"
        NODE_VERSION = "22.14.0"
        PORT        = "3082"
        NVM_DIR     = "${WORKSPACE}/.nvm"
    }

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy to server?')
    }

    options {
        timestamps()
    }

    stages {

        stage('Verify Credentials') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DO_SSH_PASSWORD',
                    usernameVariable: 'SSH_USER',
                    passwordVariable: 'SSH_PASS'
                )]) {
                    echo "🟢 SSH Password OK"
                }
            }
        }

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
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
                    node -v
                    npm -v
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
                script {

                    echo "🔐 Connecting and deploying..."

                    // -----------------------------------------
                    // 1️⃣ Kill old process on remote server
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} \
                        "lsof -t -i:${PORT} | xargs -r kill -9 || echo '⚠️ No running process'"
                    '''

                    // -----------------------------------------
                    // 2️⃣ Backup existing build
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} \
                        "cd ${REMOTE_DIR} && rm -rf build.bak && mv build build.bak 2>/dev/null || true"
                    '''

                    // -----------------------------------------
                    // 3️⃣ Upload new build
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no \
                        build.tar.gz ${PROD_USER}@${PROD_HOST}:${REMOTE_DIR}/
                    '''

                    // -----------------------------------------
                    // 4️⃣ Extract and replace build
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} \
                        "cd ${REMOTE_DIR} && rm -rf build && mkdir build && tar xzf build.tar.gz -C build && rm -f build.tar.gz"
                    '''

                    // -----------------------------------------
                    // 5️⃣ Start new React app
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} \
                        "cd ${REMOTE_DIR}/build && nohup npx serve -s . -l ${PORT} > serve.log 2>&1 &"
                    '''

                    // -----------------------------------------
                    // 6️⃣ Verify deployment
                    // -----------------------------------------
                    sh '''
                        sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} \
                        "[ -d ${REMOTE_DIR}/build ] && echo '✅ Deployment Success' || (echo '❌ Failed — Rolling back' && mv ${REMOTE_DIR}/build.bak ${REMOTE_DIR}/build)"
                    '''
                }
            }
        }
    }

    post {
        success { echo "✅ React Deployment Completed Successfully!" }
        failure { echo "❌ Deployment Failed!" }
    }
}
