import numpy as np

def create_protein_dot_plot(seq1, seq2, window_size=20, stringency=5):
    """
    Create a dot plot matrix optimized for detecting distant protein relationships
    and conserved active sites.
    
    Parameters:
    seq1, seq2: protein sequences to compare
    window_size: size of sliding window (default=20 for distant relationships)
    stringency: minimum matches required in window (default=5 for loose matching)
    
    Returns:
    filtered_matrix: boolean matrix showing significant matches
    match_positions: list of positions where significant matches were found
    """
    # Create initial dot matrix
    basic_matrix = np.zeros((len(seq1), len(seq2)))
    for i in range(len(seq1)):
        for j in range(len(seq2)):
            if seq1[i] == seq2[j]:
                basic_matrix[i][j] = 1
    
    # Create filtered matrix
    filtered_matrix = np.zeros_like(basic_matrix)
    match_positions = []
    half_window = window_size // 2
    
    # Apply sliding window with low stringency
    for i in range(half_window, len(seq1) - half_window):
        for j in range(half_window, len(seq2) - half_window):
            # Count matches in diagonal window
            match_count = 0
            window_matches = []
            for k in range(-half_window, half_window + 1):
                if basic_matrix[i + k][j + k] == 1:
                    match_count += 1
                    window_matches.append((seq1[i + k], i + k))
            
            # If stringency met, store match information
            if match_count >= stringency:
                filtered_matrix[i][j] = 1
                match_positions.append({
                    'position1': i,
                    'position2': j,
                    'matching_residues': window_matches
                })
    
    return filtered_matrix, match_positions

# Example with two hypothetical protein sequences with conserved active sites
# In this example, we have two distantly related proteases with conserved catalytic triad
seq1 = "MKVLLAATGFEPGWMSTRIGDEVHKQLVPASPWVDTVKAGFDHVTYLRDWGPKGPVVLHCHG"
seq2 = "MKITFAGTPQPAWLSTRLTHAVCKQMIPSTPWIDKIKEGFDRVTFLRDWGEKGPLLLHYHG"

# Create dot plot with large window and low stringency
filtered_matrix, match_positions = create_protein_dot_plot(
    seq1, seq2, 
    window_size=20,  # Large window to capture dispersed similarities
    stringency=5     # Low stringency to detect weak relationships
)

# Analyze results
print("Protein Sequence Comparison:")
print(f"Sequence 1: {seq1}")
print(f"Sequence 2: {seq2}")
print("\nSignificant matches found:")
for match in match_positions[:3]:  # Show first 3 matches as example
    print(f"\nMatch at positions {match['position1']} and {match['position2']}:")
    print("Matching residues in window:", 
          [(res, pos) for res, pos in match['matching_residues']])

# Function to find potential active site residues
def find_conserved_sites(match_positions):
    """Identify frequently matched positions that might be part of active sites"""
    position_frequency = {}
    for match in match_positions:
        for res, pos in match['matching_residues']:
            if pos not in position_frequency:
                position_frequency[pos] = {'residue': res, 'count': 0}
            position_frequency[pos]['count'] += 1
    
    # Return positions that appear frequently
    return {pos: data for pos, data in position_frequency.items() 
            if data['count'] > len(match_positions) / 3}

conserved_sites = find_conserved_sites(match_positions)
print("\nPotential conserved active site residues:")
for pos, data in conserved_sites.items():
    print(f"Position {pos}: Residue {data['residue']} (appeared in {data['count']} windows)")