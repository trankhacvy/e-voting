use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

declare_id!("HSmGXbf8A3j7U3Mnf6i9N6tvDCyD5Usp1FSKYHMqDKsz");

#[program]
pub mod evoting_system {
    use super::*;

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        name: String,
        description: String,
        start_date: i64,
        end_date: i64,
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let now = Clock::get().unwrap().unix_timestamp;
        // TODO validate name, description length
        candidate.name = name;
        candidate.description = description;
        candidate.start_date = start_date;
        candidate.end_date = end_date;
        candidate.created_at = now;
        candidate.amount = 0;
        candidate.mint = ctx.accounts.mint.key();

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, amount: u64) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let ballot = &mut ctx.accounts.ballot;

        let now = Clock::get().unwrap().unix_timestamp;
        if now < candidate.start_date || now > candidate.end_date {
            return err!(ErrorCode::NotActiveCandidate);
        }

        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.voter_token_account.to_account_info(),
                to: ctx.accounts.candidate_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        candidate.amount += amount;

        ballot.authority = ctx.accounts.authority.key();
        ballot.candidate = candidate.key();
        ballot.amount += amount;

        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let ballot = &mut ctx.accounts.ballot;

        let now = Clock::get().unwrap().unix_timestamp;
        if now > candidate.end_date {
            return err!(ErrorCode::EndedCandidate);
        }

        let seeds: &[&[&[u8]]] = &[&[
            "treasurer".as_ref(),
            &candidate.key().to_bytes(),
            &[*ctx.bumps.get("treasurer").unwrap()],
        ]];
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.candidate_token_account.to_account_info(),
                to: ctx.accounts.voter_token_account.to_account_info(),
                authority: ctx.accounts.treasurer.to_account_info(),
            },
            seeds,
        );
        token::transfer(transfer_ctx, ballot.amount)?;
        ballot.amount = 0;

        Ok(())
    }
}

#[account]
pub struct Candidate {
    mint: Pubkey,
    amount: u64,
    name: String,
    description: String,
    created_at: i64,
    start_date: i64,
    end_date: i64,
}

impl Candidate {
    pub const SIZE: usize = 8 + 32 + 8 + 4 * 10 + 256 * 4 + 8 + 8;
}

#[derive(Accounts)]
pub struct InitializeCandidate<'info> {
    #[account(
        init,
        payer = authority,
        space = Candidate::SIZE,
    )]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [b"treasurer".as_ref(), &candidate.key().to_bytes()],
        bump
    )]
    /// CHECK: Just a pure account
    pub treasurer: AccountInfo<'info>,
    pub mint: Box<Account<'info, token::Mint>>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = treasurer,
    )]
    pub candidate_token_account: Account<'info, token::TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Ballot {
    authority: Pubkey,
    candidate: Pubkey,
    amount: u64,
}

impl Ballot {
    pub const SIZE: usize = 8 + 32 + 32 + 8;
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut, has_one = mint)]
    pub candidate: Account<'info, Candidate>,
    #[account(
        seeds = [b"treasurer".as_ref(), &candidate.key().to_bytes()],
        bump
    )]
    /// CHECK: Just a pure account
    pub treasurer: AccountInfo<'info>,
    pub mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = treasurer,
    )]
    pub candidate_token_account: Account<'info, token::TokenAccount>,
    #[account(
        init_if_needed,
        payer = authority,
        space = Ballot::SIZE,
        seeds = [b"ballot".as_ref(), &candidate.key().to_bytes(), &authority.key().to_bytes()],
        bump
    )]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub voter_token_account: Account<'info, token::TokenAccount>,
    // system program address
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, has_one = mint)]
    pub candidate: Account<'info, Candidate>,
    #[account(
        seeds = [b"treasurer".as_ref(), &candidate.key().to_bytes()],
        bump
    )]
    /// CHECK: Just a pure account
    pub treasurer: AccountInfo<'info>,
    pub mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = treasurer,
    )]
    pub candidate_token_account: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        close = authority,
        seeds = [b"ballot".as_ref(), &candidate.key().to_bytes(), &authority.key().to_bytes()],
        bump
    )]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub voter_token_account: Account<'info, token::TokenAccount>,
    // system program address
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The candidate isn't active")]
    NotActiveCandidate,
    #[msg("The candidate is ended")]
    EndedCandidate,
}
