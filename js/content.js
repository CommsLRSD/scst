/* =============================================================================
 * SCST CONTENT MODEL
 * -----------------------------------------------------------------------------
 * This file is the single source of truth for everything shown in the app.
 * The interface is generated entirely from the objects below, so you can
 * maintain the site without touching the HTML/CSS/JS logic.
 *
 * HOW TO UPDATE CONTENT LATER:
 *   • Edit text in the `sections` array to change guided-mode content.
 *   • Add / edit people inside `teamStructure.areas[].people`.
 *   • Add / edit tiers inside the `tiers` array.
 *   • Placeholder hooks for future features (PDF downloads, contact links)
 *     live on each person and section object — search for "HOOK:".
 *
 * Every section has a stable `id` (used for jump-to + deep links) and an
 * `icon` (an inline SVG name resolved in app.js).
 * ========================================================================== */

const SCST_CONTENT = {
  meta: {
    title: "School & Classroom Support Team",
    division: "Louis Riel School Division",
    tagline:
      "Supporting Every School. Strengthening Every Classroom. Ensuring Every Student Thrives.",
    intro:
      "An interactive guide to how the School and Classroom Support Team (SCST) partners with schools to strengthen student learning, well-being, and belonging.",
    // HOOK: add a downloadable PDF of the source document here later.
    pdfUrl: null,
    // HOOK: add a general contact email/link for the team here later.
    contactUrl: null,
  },

  /* ---------------------------------------------------------------------------
   * TOP-LEVEL SECTIONS (drive both Guided mode and the section map)
   * Each `blocks` entry is a small, digestible unit rendered as a card.
   * Block types: "lead" | "list" | "note" | "grid".
   * ------------------------------------------------------------------------- */
  sections: [
    {
      id: "overview",
      label: "Overview",
      icon: "compass",
      title: "Who We Are",
      summary:
        "SCST partners with schools across Louis Riel School Division to strengthen learning, well-being, and belonging.",
      blocks: [
        {
          type: "lead",
          text:
            "The School and Classroom Support Team (SCST) partners with schools across the Louis Riel School Division to strengthen student learning, well-being, and belonging.",
        },
        {
          type: "list",
          heading: "Our work is grounded in",
          items: [
            "Equity and reconciliation",
            "Evidence-informed practice",
            "Strong, relational partnerships with school teams and communities",
          ],
        },
        {
          type: "list",
          heading: "We work alongside schools to",
          items: [
            "Build instructional and system capacity",
            "Respond to identified student and school needs",
            "Close opportunity gaps — particularly for Indigenous students and learners experiencing barriers",
          ],
        },
        {
          type: "note",
          text:
            "SCST is a coordinated, system-level team that integrates leadership, instructional support, clinical services, Indigenous education, and specialized supports into one aligned model.",
        },
      ],
      takeaway:
        "SCST is one aligned, system-level team focused on equity, evidence, and strong partnerships with schools.",
    },

    {
      id: "why",
      label: "Why This Matters",
      icon: "heart",
      title: "Why This Work Matters",
      summary:
        "Divisional data highlights persistent gaps — SCST focuses support where the need is greatest.",
      blocks: [
        {
          type: "list",
          heading:
            "Divisional data — literacy & numeracy screening, progress monitoring, attendance, and well-being indicators — continues to highlight",
          items: [
            "Persistent achievement gaps across schools",
            "Disproportionate impact on Indigenous students",
            "Students with multiple indicators of risk (academic, engagement, attendance)",
          ],
        },
        {
          type: "list",
          heading: "This data informs how SCST prioritizes support",
          items: [
            "Schools with the greatest need receive more intensive and coordinated support",
            "Supports are constantly monitored and adjusted based on impact",
          ],
        },
        {
          type: "list",
          heading:
            "This work directly advances the LRSD Multi-Year Strategic Plan through",
          items: [
            "Closing opportunity gaps",
            "Strengthening responsive instruction",
            "Supporting belonging and well-being",
            "Embedding Indigenous education and reconciliation",
          ],
        },
      ],
      takeaway:
        "Data reveals real gaps — SCST directs the most coordinated support to the schools that need it most.",
    },

    {
      id: "how",
      label: "How Support Works",
      icon: "handshake",
      title: "How We Support Schools",
      summary:
        "Differentiated, data-informed collaboration that strengthens instruction and builds capacity.",
      blocks: [
        {
          type: "lead",
          text:
            "SCST provides differentiated, data-informed support, collaborating with schools rather than working in isolation.",
        },
        {
          type: "list",
          heading: "SCST collaborates with schools to",
          items: [
            "Analyze data",
            "Strengthen instructional practice",
            "Support professional learning",
            "Mentor staff",
            "Build inclusive and culturally responsive environments",
          ],
        },
      ],
      takeaway:
        "Support is differentiated and collaborative — grounded in data and focused on building lasting capacity.",
    },

    {
      id: "tiers",
      label: "Levels / Tiers",
      icon: "layers",
      title: "Levels of Support",
      summary:
        "A tiered model — Universal, Targeted, and Intensive — matches support to need.",
      blocks: [
        {
          type: "note",
          text:
            "SCST support is organized into three tiers. Compare them side-by-side below — each tier builds on the one before it.",
        },
        { type: "tiers" }, // rendered as the Tier comparison component
      ],
      takeaway:
        "Every school gets Tier 1 universal support; Tier 2 and Tier 3 add targeted and intensive help where data shows need.",
    },

    {
      id: "data",
      label: "Data-Informed",
      icon: "chart",
      title: "Using Data to Guide Our Work",
      summary:
        "Multiple divisional data sources identify need early and monitor impact over time.",
      blocks: [
        {
          type: "list",
          heading:
            "SCST uses a range of divisional data sources to identify need and monitor impact",
          items: [
            "Literacy and numeracy screening",
            "Progress monitoring data",
            "Attendance and well-being indicators",
            "Indigenous student gap indicators",
            "Classroom and school context",
          ],
        },
        {
          type: "list",
          heading: "This ensures",
          items: [
            "Early identification of students requiring support",
            "Targeted and responsive intervention",
            "Ongoing monitoring and adjustment",
          ],
        },
      ],
      takeaway:
        "Data drives every decision — from spotting need early to adjusting supports based on impact.",
    },

    {
      id: "team",
      label: "Team Structure",
      icon: "users",
      title: "Our Team Structure",
      summary:
        "Six integrated areas of support, from Leadership to Specialized Supports — explore the people behind each.",
      blocks: [
        {
          type: "note",
          text:
            "SCST is organized into six integrated areas of support. Filter by area and expand any area to meet the people who make it happen.",
        },
        { type: "team" }, // rendered as the interactive team component
      ],
      takeaway:
        "Six integrated areas — Leadership, Instructional Support, Student Support Services, Indigenous Education, Clinical Services, and Specialized Supports — work as one aligned team.",
    },

    {
      id: "school-based",
      label: "School-Based Model",
      icon: "building",
      title: "School-Based Support Model",
      summary:
        "Responsive, equity-focused allocation of time and expertise, backed by an Equity Support School model.",
      blocks: [
        {
          type: "lead",
          text:
            "SCST provides supports based on a combination of divisional data, school-level context, and identified student and staff needs. This responsive approach aligns resources to where they will have the greatest impact, while building long-term capacity across all schools.",
        },
        {
          type: "note",
          text:
            "SCST works in partnership with school teams to analyze data (achievement, well-being, attendance, and engagement) and to co-develop plans that are strengths-based, culturally responsive, and focused on improving outcomes for all learners.",
        },
        {
          type: "note",
          heading: "Equity Support School Model",
          text:
            "SCST uses a tiered model to differentiate levels of support across schools — allowing targeted allocation of time, expertise, and resources while keeping a strong focus on equity, inclusion, and capacity building.",
        },
        {
          type: "list",
          heading: "Embedded Support Rationale — staff are assigned to schools based on",
          items: [
            "Indigenous student opportunity gaps",
            "Attendance and engagement indicators",
            "Literacy and numeracy data",
            "Number of students with multiple risk factors",
            "Need for sustained relational support",
          ],
        },
      ],
      takeaway:
        "Support follows the data — staff are embedded where opportunity gaps and risk factors are greatest, always with equity at the centre.",
    },

    {
      id: "direction",
      label: "Current Direction",
      icon: "route",
      title: "Instructional Support — Current Direction",
      summary:
        "A wave-based support model focuses literacy and numeracy on the highest-need schools.",
      blocks: [
        {
          type: "grid",
          heading: "Focus areas for 2026–2027",
          items: [
            {
              title: "Literacy (2026–2027)",
              points: [
                "Wave-based support model across priority schools",
                "Focused on highest-need schools identified through data",
              ],
            },
            {
              title: "Numeracy (2026–2027)",
              points: [
                "Wave-based support model across priority schools",
                "Focused on highest-need schools identified through data",
              ],
            },
          ],
        },
      ],
      takeaway:
        "Literacy and numeracy support is moving to a wave-based model, concentrating effort on the highest-need schools.",
    },

    {
      id: "ahead",
      label: "Looking Ahead",
      icon: "telescope",
      title: "Looking Ahead",
      summary:
        "SCST keeps evolving toward more embedded, collaborative, data-informed support.",
      blocks: [
        {
          type: "list",
          heading: "SCST continues to evolve to",
          items: [
            "Increase embedded, in-school support",
            "Strengthen collaboration across teams",
            "Refine data-informed decision-making",
            "Expand impact through tiered instructional models",
            "Improve outcomes for students, particularly those experiencing barriers",
          ],
        },
        {
          type: "note",
          heading: "Specialized Teacher Mentorship",
          text:
            "Mentorship spans Library, Phys. Ed, Music, Applied Technology, Human Ecology, Student Services, and Teachers New to LRSD.",
        },
      ],
      takeaway:
        "The direction is clear: more embedded support, stronger collaboration, sharper use of data, and better outcomes for students facing barriers.",
    },
  ],

  /* ---------------------------------------------------------------------------
   * TIER COMPARISON (used by the Levels/Tiers section)
   * ------------------------------------------------------------------------- */
  tiers: [
    {
      id: "tier1",
      level: "Tier 1",
      name: "Universal Support",
      reach: "All schools",
      summary:
        "Building strong, inclusive, and responsive learning environments for every school.",
      items: [
        "Access to divisional professional learning opportunities",
        "Universal resources, tools, and frameworks to support teaching and learning",
        "Consultation upon request",
        "Support for implementing divisional priorities (literacy, numeracy, well-being, Indigenous education)",
        "Opportunities for networking and collaboration across schools",
      ],
      goal:
        "Proactive capacity building so all students experience a high-quality, equitable learning environment.",
    },
    {
      id: "tier2",
      level: "Tier 2",
      name: "Targeted Support",
      reach: "Identified schools",
      summary:
        "Short- to medium-term support focused on specific areas of need identified through data and context.",
      items: [
        "Planned cycles of support (coaching, consultation, or collaborative inquiry)",
        "Support with implementing evidence-informed strategies",
        "Joint problem-solving with school teams and leadership",
        "Professional learning tailored to priorities (literacy, regulation, inclusion)",
        "Check-ins to monitor progress and adjust supports as needed",
      ],
      goal:
        "Strengthen key practices, build staff confidence and skill, and address emerging needs before they intensify.",
    },
    {
      id: "tier3",
      level: "Tier 3",
      name: "Intensive Support",
      reach: "Highest-need schools",
      summary:
        "The highest level of involvement — frequent, collaborative, and responsive to complex or urgent needs.",
      items: [
        "Ongoing, embedded support from multidisciplinary team members",
        "Regular in-school presence to co-plan, co-teach, and model practices",
        "Intensive data analysis and progress monitoring",
        "Support with comprehensive school-based action planning",
        "Coordination with external agencies and specialized services",
        "Focused efforts to address significant gaps in achievement, well-being, or engagement",
      ],
      goal:
        "Stabilize systems, address immediate needs, and build sustainable structures for continued growth.",
    },
  ],

  /* ---------------------------------------------------------------------------
   * TEAM STRUCTURE — six integrated areas, each with people.
   * `filter` is the plain-language label used by the team filter chips.
   * Each person: { name, title, summary }. HOOK: add `contactUrl` per person.
   * ------------------------------------------------------------------------- */
  teamStructure: {
    areas: [
      {
        id: "leadership",
        filter: "Leadership",
        title: "Leadership",
        icon: "star",
        purpose:
          "Leadership ensures system coherence, alignment to the Multi-Year Strategic Plan, and coordinated support across all SCST areas.",
        keyWork: [
          "Align supports to divisional priorities and data",
          "Coordinate cross-team collaboration",
          "Respond to emerging school needs",
          "Ensure equity-driven decision-making",
        ],
        people: [
          {
            name: "Nicholas Kelly",
            title: "Director of School and Classroom Support",
            summary:
              "Provides overall leadership for SCST, ensuring coordinated, responsive, and equity-focused support across the division. Works closely with school and divisional leaders to align services, strengthen coherence, and improve outcomes for all students.",
          },
          {
            name: "Nicole Mager",
            title: "Divisional Principal (Instructional & Indigenous Education)",
            summary:
              "Leads instructional and Indigenous education supports across the division. Partners with schools to strengthen teaching, advance culturally responsive learning, and support meaningful, engaging learning experiences for all students.",
          },
          {
            name: "Megan Vankoughnett",
            title: "Divisional Principal (Clinical & Student Services)",
            summary:
              "Provides leadership for clinical and student services, supporting inclusive and responsive learning environments. Works collaboratively with schools to ensure student needs are met through coordinated, evidence-informed approaches.",
          },
          {
            name: "Lisa Tymchuk",
            title: "Assistant Director, Clinical Services",
            summary:
              "Supports the delivery of clinical services across the division, coordinating interdisciplinary supports. Works with school teams to strengthen practices that support learning, communication, regulation, and well-being.",
          },
          {
            name: "Kelsey Lenaghan",
            title: "Divisional Indigenous Leader",
            summary:
              "Leads Indigenous education and intercultural understandings across the division. Works alongside schools to strengthen relationships, support IESAP planning, and embed Indigenous perspectives, identities, and ways of knowing into learning.",
          },
        ],
      },
      {
        id: "instructional",
        filter: "Instructional Support",
        title: "Instructional Support (Literacy & Numeracy)",
        icon: "book",
        purpose:
          "Instructional support strengthens classroom practice, improves student achievement, and builds teacher capacity.",
        keyWork: [
          "Early screening and progress monitoring",
          "Structured literacy and numeracy practices",
          "Intervention planning",
          "Co-planning and co-teaching",
          "Instructional coaching and mentorship",
          "Data-informed instructional decision-making",
        ],
        people: [
          {
            name: "Kristyn Artibise",
            title: "Instructional Support Teacher (Numeracy)",
            summary:
              "Supports schools in strengthening numeracy instruction through data-informed practices, targeted intervention planning, and collaborative problem solving — building confidence and capacity in teaching mathematics so all students can succeed.",
          },
          {
            name: "Kristen McDowell",
            title: "Instructional Support Teacher (Literacy)",
            summary:
              "Partners with schools to strengthen literacy instruction using structured, evidence-informed approaches, supporting educators through coaching, co-planning, and the use of data to guide responsive instruction.",
          },
          {
            name: "Geneviève Shyiak",
            title: "Instructional Support Teacher (Literacy)",
            summary:
              "Works collaboratively with school teams to enhance literacy learning and instructional practice, supporting teachers in using data to inform instruction, monitor progress, and create responsive learning environments.",
          },
        ],
      },
      {
        id: "student-services",
        filter: "Student Support Services",
        title: "Student Support Services",
        icon: "shield",
        purpose:
          "Student Support Services creates inclusive, responsive environments that address academic, behavioural, and social-emotional needs.",
        keyWork: [
          "MEECL, RAF, and TCIS frameworks",
          "Mentor support for new teachers",
          "Transitions planning",
          "Student-centered data use",
          "Support for multilingual learners",
        ],
        people: [
          {
            name: "Kerri Bush",
            title: "Instructional Support / Student Services",
            summary:
              "Supports schools in creating inclusive, responsive learning environments — strengthening classroom practices, supporting social-emotional learning, and building strategies that enhance student well-being and engagement.",
          },
          {
            name: "Rose Pagtakhan",
            title: "Instructional Support / Student Services",
            summary:
              "Specializes in supporting multilingual learners across the division, partnering with teachers to design inclusive, language-rich instruction that supports both academic achievement and language development.",
          },
        ],
      },
      {
        id: "indigenous",
        filter: "Indigenous Education",
        title: "Indigenous Education",
        icon: "feather",
        purpose:
          "The Indigenous Education Team partners with schools to advance Indigenous student success through culture, identity, and relationship.",
        keyWork: [
          "Indigenous Education School-Based Action Plans (IESAP)",
          "Data analysis and goal setting",
          "Cultural teachings and land-based learning",
          "Language programming",
          "Connection to Elders and Knowledge Keepers",
        ],
        note:
          "IESAP Process — Schools form Indigenous Education Action Teams, analyze data and community voice, identify strengths and barriers, then develop and implement action plans.",
        people: [
          {
            name: "Sean Oliver",
            title: "Indigenous Education",
            summary:
              "Supports schools through land-based learning, cultural teachings, and IESAP — strengthening connection to culture, identity, and community, and creating meaningful learning experiences rooted in relationship.",
          },
          {
            name: "Rose Bird",
            title: "Indigenous Education",
            summary:
              "Partners with schools to support Indigenous language, culture, identity, and IESAP — deepening understanding, strengthening belonging, and creating inclusive learning environments grounded in respect and connection.",
          },
          {
            name: "Judith Saunders-McKay",
            title: "Indigenous Education",
            summary:
              "Supports Indigenous education through language, cultural learning, relationship-building, and IESAP — fostering understanding, respect, and a strong sense of identity and belonging.",
          },
          {
            name: "Sam Flamand",
            title: "Indigenous Education",
            summary:
              "Supports Indigenous language and cultural learning across schools and IESAP — strengthening culturally responsive practices and creating spaces where students feel seen, valued, and connected.",
          },
          {
            name: "Trish Wilson",
            title: "Indigenous Education",
            summary:
              "Works with schools to support Indigenous education through cultural programming, relationship-building, student engagement, and IESAP — while supporting staff learning and inclusive, welcoming environments.",
          },
          {
            name: "Tammy Bruce",
            title: "Community Liaison – Indigenous Academic Support",
            summary:
              "Connects students, families, schools, and community supports — strengthening relationships, supporting student well-being, and ensuring schools are responsive to the needs and strengths of their communities.",
          },
          {
            name: "Alice McKay",
            title: "Ojibwe Teacher — Indigenous Language Team",
            summary:
              "Teaches Ojibwe language and supports students in developing strong connections to language, culture, and identity, while supporting IESAP and deepening understanding of Indigenous ways of knowing.",
          },
          {
            name: "Courtney Pranteau",
            title: "Cree Teacher — Indigenous Language Team",
            summary:
              "Teaches Cree language and works with students to build confidence and connection through language learning while supporting IESAP, cultural understanding, identity, and belonging.",
          },
          {
            name: "Maxine Lavitt",
            title: "Michif Instructor — Indigenous Language Team",
            summary:
              "Teaches Michif, supporting language revitalization and cultural connection while supporting IESAP — strengthening identity, pride, and understanding of Métis culture through meaningful learning.",
          },
          {
            name: "Cub Spring",
            title: "Ojibwe Instructor — Indigenous Language Team",
            summary:
              "Supports students in learning Ojibwe language while fostering connection to culture and community and supporting IESAP — creating engaging, meaningful language learning opportunities.",
          },
          {
            name: "Rhea Paul",
            title: "Ojibwe Instructor — Indigenous Language Team",
            summary:
              "Supports Ojibwe language learning across schools, helping students develop communication skills and cultural understanding while supporting IESAP and strengthening identity and belonging.",
          },
          {
            name: "Alyssa Guimond",
            title: "Ojibwe Instructor — Indigenous Language Team",
            summary:
              "Supports students in learning Ojibwe language in engaging, responsive ways while supporting IESAP — working with school teams to support language development and cultural connection.",
          },
          {
            name: "Hailey McKay",
            title: "Cree Instructor — Indigenous Language Team",
            summary:
              "Supports Cree language learning and works with students to build connection, confidence, and cultural understanding while supporting IESAP and creating inclusive environments where language and identity are valued.",
          },
          {
            name: "Destanee Ducharme",
            title: "Cree Instructor — Indigenous Language Team",
            summary:
              "Supports Cree language instruction and works with students to strengthen their understanding of culture, identity, and community while supporting IESAP and creating meaningful, connected learning experiences.",
          },
          {
            name: "Rose McKay",
            title: "Cree Instructor — Indigenous Language Team",
            summary:
              "Supports Cree language learning through relationship, storytelling, and cultural connection while supporting IESAP — helping students build confidence and pride in language and identity.",
          },
        ],
      },
      {
        id: "clinical",
        filter: "Clinical Services",
        title: "Clinical Services",
        icon: "pulse",
        purpose:
          "Clinical Services supports communication, regulation, and well-being through interdisciplinary collaboration.",
        keyWork: [
          "Occupational Therapy",
          "Psychology",
          "Speech Language Pathology",
          "Social Work",
          "Social-emotional and regulation support",
          "Transition planning",
          "Professional learning for staff",
        ],
        people: [
          {
            name: "Robert George",
            title: "Psychologist",
            summary:
              "Supports schools through assessment, consultation, and collaborative problem solving — helping educators understand student learning and well-being needs to guide effective, data-informed supports and interventions.",
          },
          {
            name: "Travis Hoare",
            title: "Occupational Therapist",
            summary:
              "Supports students in developing self-regulation, independence, and participation in learning, working with school teams to design inclusive, responsive strategies for daily classroom success.",
          },
          {
            name: "Karla Guiterrez",
            title: "Speech Language Pathologist",
            summary:
              "Supports students and educators in strengthening communication, language development, and literacy foundations, collaborating with school teams on strategies that support learning, engagement, and participation.",
          },
          {
            name: "Kim Mackey",
            title: "Social Worker",
            summary:
              "Supports students' social-emotional well-being, mental health, and sense of belonging — collaborating with educators, families, and community partners to help students build resilience and engage fully in learning.",
          },
        ],
      },
      {
        id: "specialized",
        filter: "Specialized Supports",
        title: "Specialized Supports",
        icon: "sparkles",
        purpose:
          "Specialized supports enhance school programming, engagement, and discipline-specific instruction.",
        keyWork: [
          "Library Services",
          "Physical Education & Healthy Living",
          "Extra-Curricular Athletics",
          "LRSD Arts (Music, Visual Arts, Drama)",
          "Applied Technology and Human Ecology",
        ],
        people: [
          {
            name: "Kathy Atkin",
            title: "Divisional Teacher Librarian (Libraries)",
            summary:
              "Supports school libraries across the division, creating welcoming, literacy-rich environments that foster a love of reading and inquiry, and partnering with educators to enhance access to diverse resources.",
          },
          {
            name: "Shaemus Campbell",
            title: "Physical Education & Healthy Living",
            summary:
              "Supports high-quality physical education and active, healthy lifestyles — strengthening PE programming, mentoring educators, and coordinating divisional events that engage students in activity and well-being.",
          },
          {
            name: "Jordana Milne",
            title: "Manager of Athletics and Healthy Living",
            summary:
              "Leads and coordinates divisional extra-curricular athletics, supporting inclusive, engaging sport opportunities and helping build strong school-based programs and positive experiences through teamwork.",
          },
          {
            name: "Ryan Sabourin",
            title: "Applied Technology / Human Ecology",
            summary:
              "Supports applied technology and human ecology programming across the division — creating safe, innovative, engaging learning experiences that prepare students with practical skills and real-world connections.",
          },
          {
            name: "Allan Suban",
            title: "LRSD Arts (Music, Visual Arts, Drama)",
            summary:
              "Supports arts programming in schools, fostering creativity, expression, and engagement — strengthening music, visual arts, and drama experiences that enrich learning and build student confidence.",
          },
        ],
      },
    ],
  },
};

// Expose the model globally for the app (no build step / no modules required).
window.SCST_CONTENT = SCST_CONTENT;
