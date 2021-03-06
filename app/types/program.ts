export type EvotingSystem = {
    "version": "0.1.0",
    "name": "evoting_system",
    "instructions": [
      {
        "name": "initializeCandidate",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          }
        ]
      },
      {
        "name": "vote",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ballot",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "voterTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "close",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ballot",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "voterTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "candidate",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "createdAt",
              "type": "i64"
            },
            {
              "name": "startDate",
              "type": "i64"
            },
            {
              "name": "endDate",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "ballot",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "candidate",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "NotActiveCandidate",
        "msg": "The candidate isn't active"
      },
      {
        "code": 6001,
        "name": "EndedCandidate",
        "msg": "The candidate is ended"
      }
    ]
  };
  
  export const IDL: EvotingSystem = {
    "version": "0.1.0",
    "name": "evoting_system",
    "instructions": [
      {
        "name": "initializeCandidate",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          }
        ]
      },
      {
        "name": "vote",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ballot",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "voterTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "close",
        "accounts": [
          {
            "name": "candidate",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasurer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "candidateTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ballot",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "voterTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "candidate",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "createdAt",
              "type": "i64"
            },
            {
              "name": "startDate",
              "type": "i64"
            },
            {
              "name": "endDate",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "ballot",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "candidate",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "NotActiveCandidate",
        "msg": "The candidate isn't active"
      },
      {
        "code": 6001,
        "name": "EndedCandidate",
        "msg": "The candidate is ended"
      }
    ]
  };
  