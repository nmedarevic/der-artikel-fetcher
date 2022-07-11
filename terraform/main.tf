provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1" # Setting my region to London. Use your own region here
}

resource "aws_ecr_repository" "der_artikel_app_repo" {
  name = "der-artikel-app-repo" # Naming my repository
}